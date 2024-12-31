from flask import Flask, jsonify, request
from flask_cors import CORS
from degree_programs import course_data
import json
from RMPclasses import RateMyProfScraper
from utils import *
from RMPclasses import RateMyProfScraper
import requests
app = Flask(__name__)
CORS(app)
#TODO Find all of the classes that have not been uploaded

@app.route("/api/professor" ,methods = ['GET'])
def scrape_professor():
	subject = request.args.get('professor')
	c = RateMyProfScraper(school_id = 18846)
	res = c.getProfessor(prof_name=subject)
	print("Here is the res: ",res)
	return jsonify(res)



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
	# If you want to loop uncomment this
	course_data_list = list(course_data.values())
	for val in course_data_list[73:]:  # Start iteration at the 23rd index
		scrape_class(val)
		create_json_file('course_data.json' ,val)


	# scrape_class("SzW")
	# create_json_file('course_data.json' ,"SzW")

	app.run(debug = True)


