from flask import Flask, jsonify
from flask_cors import CORS

import json
from utils import *
app = Flask(__name__)
CORS(app)




@app.route("/api/courses" ,methods = ['GET'])
def get_courses():
	"""
	API endpoint to retrieve courses for a specific subject.
	Usage: /api/courses?subject=CECS
	"""
	subject = request.args.get('subject')

	if not subject:
		return jsonify({"error": "Subject abbreviation ('subject') is required as a query parameter."}) ,400

	filename = 'course_data.json'
	data = load_data(filename)

	subject_upper = subject.upper()

	if subject_upper in data:
		print(f"Serving cached data for subject '{subject_upper}'.")
		return jsonify({"courses": data[subject_upper]}) ,200
	else:
		return jsonify({"error": f"No data found for subject '{subject_upper}'."}) ,404



loaded_course = 'course_data.json'

if __name__ == "__main__":
	# load_data(loaded_course)
	scraped_data=scrape_class("CECS")
	create_json_file('course_data.json', "CECS")


	# app.run(debug = True)zx


