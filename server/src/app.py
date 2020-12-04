import json
from flask import Flask, Response, request, redirect, render_template
from flask_cors import CORS
from typing import Union
from werkzeug.exceptions import HTTPException, BadRequest

from controllers.url_mapping_controller import URLMappingController

app = Flask(__name__, static_url_path="/static")
CORS(app=app, resources={r"*": {"origin": "*"}})


@app.errorhandler(BadRequest)
def handle_bad_request(e):
    return Response(json.dumps({'error': 'bad request!'}), status=400)


@app.errorhandler(Exception)
def hanlde_generic_exception(e):
    response = e.get_response()
    response.data = json.dumps({
        "code": e.code,
        "name": e.name,
        "description": e.description,
    })
    response.content_type = "application/json"
    return response


@app.route('/', methods=['GET'], defaults={'short_url': None})
@app.route('/<short_url>', methods=['GET'])
def handle_redirect(short_url):
    if short_url:
        long_url: Union[str, None] = URLMappingController(None,
                                                          short_url=short_url).long_url()

        if long_url:
            if long_url.find("http://") != 0 and long_url.find("https://") != 0:
                long_url = "http://" + long_url
            return redirect(long_url, code=301)
        else:
            return Response('', status=404)

    return render_template('index.html')


@app.route('/api/generate', methods=['POST'])
def handle_generate():
    body = request.get_json()

    try:
        long_url: str = body['long_url']
        short_url: Union[str, None] = URLMappingController(
            long_url=long_url, short_url=None).generate_and_store()

        if short_url:
            return Response(json.dumps({'short_url': short_url}), status=200)

        return Response(json.dumps({}), status=500)
    except KeyError:
        return Response(json.dumps({"code": 422, "name": "Invalid params", "description": "Unprocessable Entity"}), status=422)


if __name__ == "__main__":
    app.run("0.0.0.0", port=5000, debug=False)
