from flask import Flask, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
from degree_programs import course_data
app = Flask(__name__)
CORS(app)
url = "https://web.csulb.edu/depts/enrollment/registration/class_schedule/Spring_2025/By_Subject/ACCT.html"

response = requests.get(url)

if response.status_code == 200:
	soup = BeautifulSoup(response.text, "html.parser")
	course_block = soup.find_all("div", class_="courseBlock")

	sectionTable = soup.find_all("table", class_="sectionTable")

	all_data = []

	for el in course_block:
		course_code = el.find("span", class_="courseCode").text
		course_title = el.find("span", class_="courseTitle").text
		units = el.find("span", class_="units").text
		section_table = el.find("table", class_="sectionTable")
		print(section_table)
		if section_table:
			headers = [header.text.strip() for header in section_table.find_all("th")]
			rows = section_table.find_all("tr")[1:]  # Skip the header row

			for row in rows:
				columns = row.find_all(["th" ,"td"])
				row_data = {headers[i]: columns[i].text.strip() for i in range(len(columns))}
				row_data["Course Code"] = course_code
				row_data["Course Title"] = course_title
				row_data["Units"] = units
				all_data.append(row_data)

				print(row_data)





