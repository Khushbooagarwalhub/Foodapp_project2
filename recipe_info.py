import numpy as np
import requests
import json
from config import apiKey

random_indices = []


def get_recipe_info(user_params):

    user_params["offset"] = np.random.randint(0,11)

    # Get 10 recipe_ids matching form input criteria
    search_url = "https://api.spoonacular.com/recipes/complexSearch"
    ten_recipes = requests.get(search_url, params=user_params).json()

    # Error check - return an empty list if user's selection criteria did not 
    # produce any recipe results
    if ten_recipes['totalResults'] == 0:
        return []
    else:
        recipe_ids = [str(recipe['id']) for recipe in ten_recipes['results']]

        # Get detailed information about our recipes
        recipe_info_url = f"https://api.spoonacular.com/recipes/informationBulk?includeNutrition=true"

        info_params = {
            'ids': ",".join(recipe_ids),
            'apiKey': apiKey
        }
        recipe_response = requests.get(recipe_info_url, params=info_params).json()

        # Make a new API call to get recipe summary/description
        recipes_info = []
        for recipe in recipe_response:
            summary_url = f"https://api.spoonacular.com/recipes/{recipe['id']}/summary"
            summary_response = requests.get(
                summary_url, params={"apiKey": apiKey}).json()

            # Filter response - collect and group relevant recipe info
            recipe_info = {'summary': summary_response['summary']}
            categories_to_keep = ['image', 'servings', 'readyInMinutes',
                            'pricePerServing', 'weightWatcherSmartPoints',
                            'spoonacularScore', 'id', 'title', 'healthScore'
                            ]

            # Some recipes don't include instructions - ignore these
            # Otherwise, package all relevant recipe info in a dictionary and
            # store dictionaries in a list
            bad_recipe = False
            for key, value in recipe.items():
                if key == "analyzedInstructions":
                    if value:
                        instructions = value[0]['steps']
                        cooking_steps = [step['step'] for step in instructions]
                        recipe_info['instructions'] = cooking_steps
                    else:
                        bad_recipe = True
                        break
                elif key == "extendedIngredients":
                    ingredients = [ingredient['originalString']
                                   for ingredient in value]
                    recipe_info['ingredients'] = ingredients
                elif key == "nutrition":
                    recipe_info['caloricBreakdown'] = value['caloricBreakdown']
                    recipe_info['nutrients'] = value['nutrients']
                elif key in categories_to_keep:
                    recipe_info[key] = value
            
            if bad_recipe==True:
                continue

            # Trim away unwanted parts of summary
            strings_to_delete = [". Try",
                                "If you like this recipe",
                                "Similar recipes",
                                "Users who liked this recipe",
                                "href"
                                ]

            # Remove hyperlinks from recipe summary/description
            for string in strings_to_delete:
                summary_split = recipe_info['summary'].split(string, 2)
                if len(summary_split) == 2 and string == ". Try":
                    recipe_info['summary'] = summary_split[0] + "."
                else:
                    recipe_info['summary'] = summary_split[0]

            recipes_info.append(recipe_info)

        return recipes_info
    
