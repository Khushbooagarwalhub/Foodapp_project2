from flask import Flask, flash, render_template, request, jsonify, redirect, url_for, session
from flask_session import Session
from config import apiKey
import requests
import json
from recipe_info import get_recipe_info

#######################
##### FLASK SETUP #####
#######################
app = Flask(__name__)
SESSION_TYPE = 'filesystem'
app.config.from_object(__name__)
Session(app)

#############################################
#### HELPER FUNCTION FOR SELECTION ROUTE ####
#############################################
def grab_user_input(input):
    params = {}
    for key, value in input.items():
        if key == "excludeIngredients":
            params[key] = value.strip().replace(", ", ",")
        elif key == "includeIngredients":
            params[key] = value.strip().replace(", ", ",")
        else:
            params[key] = value
    return params

###################################
#### ROUTES TO RENDER WEBPAGES ####
###################################
@app.route('/')
def home():
    """Renders the home page."""
    return render_template('index.html')


@app.route('/recipe-page')
def recipe():
    """Renders the recipe search page."""
    return render_template("recipe.html")


@app.route('/wine-page')
def wine():
    """Renders the wine pairing page."""
    return render_template("wine.html")

@app.route('/wine-recommendation-page')
def wineRecommendation():
    """Renders the wine recommendations page."""
    return render_template("wine_recommendation.html")

@app.route('/error')
def error():
    """Renders the error page, informing user that no results 
    for recipe search were found."""
    return render_template("error.html")

###########################
#### FUNCTIONAL ROUTES ####
###########################
@app.route('/selection', methods=['POST', 'GET'])
def selection():
    """Catches all form inputs and stores values in a session object."""

    user_input = request.form
    if user_input['btn-identifier'] == 'general-btn':
        session['general'] = grab_user_input(user_input)
    elif user_input['btn-identifier'] == 'macros-btn':
        session['macros'] = grab_user_input(user_input)
    elif user_input['btn-identifier'] == 'ingredients-btn':
        session['ingredients'] = grab_user_input(user_input)
    elif user_input['btn-identifier'] == 'description-btn':
        session['description'] = grab_user_input(user_input)

    return redirect('', 204)

@app.route('/results')
def results():
    """Process user's request and then clear session."""

    full_params = {
        "apiKey": apiKey,
        "number": 10
    }

    # Filter meaningful data from session and add it to full_params
    for key, value in session.items():
        if (key!="_permanent") and value:
            for nested_key, nested_value in value.items():
                if nested_value:
                    full_params[nested_key] = nested_value

    session.clear()

    # Remove 'btn-identifier' from full_params
    try:
        del full_params['btn-identifier']
    except KeyError:
        pass

    # Get recipes using user's selection criteria
    recipes_info = get_recipe_info(full_params)

    # Error check
    if recipes_info == []:
        return redirect(url_for('error'))
    else:
        return render_template("results.html", recipe_result=recipes_info)


@app.route("/trivia")
def jokes():
    """Returns some food trivia upon request."""

    joke_response = requests.get(
        f"https://api.spoonacular.com/food/trivia/random", params={"apiKey": apiKey})
    joke_json = joke_response.json()
    return jsonify(joke_json)

@app.route("/wine_recommendation_info")
def info():
    """Queries spoonacular API for wine recommendations."""
    
    info_response = requests.get(f"https://api.spoonacular.com/food/wine/recommendation?wine='merlot'&number=5", params={"apiKey" : apiKey})
    info_json = info_response.json()
    return jsonify(info_json)

if __name__ == '__main__':
    app.run(debug=True)
