import json
import os
from filelock import FileLock
import logging
import re
import requests
from bs4 import BeautifulSoup
from degree_programs import course_data
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def load_data(filename):
	if not os.path.exists(filename):
		print(f"The file '{filename}' does not exist.")
		return {}

	with open(filename ,'r') as file:
		try:
			data = json.load(file)
			return data
		except json.JSONDecodeError:
			print(f"Error decoding JSON from the file '{filename}'.")
			return {}


def save_data(filename, data):

	lock = FileLock(f"{filename}.lock")
	with lock:
		with open(filename, 'w') as file:
			json.dump(data, file, indent=4)
	logger.info(f"Saved data to '{filename}'.")

def add_item(data, key, item):
	if key in data:
		if item not in data[key]:
			data[key].append(item)
			print(f"Added '{item}' to '{key}'.")
		else:
			print(f"'{item}' already exists in '{key}'.")
	else:
		# If the key doesn't exist, create it with the item as the first element
		data[key] = item
		print(f"Created key '{key}' and added '{item}' to it.")


def create_json_file(filename ,subject_abbreviation):
	data = load_data(filename)

	if subject_abbreviation in data:
		print(f"Data for subject '{subject_abbreviation.upper()}' already exists in '{filename}'.")
		return

	scraped_data = scrape_class(subject_abbreviation)

	if not scraped_data:
		print(f"No data scraped for subject '{subject_abbreviation}'. JSON file not updated.")
		return

	add_item(data ,subject_abbreviation ,scraped_data)

	save_data(filename ,data)
	print(f"Data for subject '{subject_abbreviation}' has been added to '{filename}'.")



def scrape_class(course):
	url = f"https://web.csulb.edu/depts/enrollment/registration/class_schedule/Spring_2025/By_Subject/{course}.html"

	response = requests.get(url)

	if response.status_code == 200:
		soup = BeautifulSoup(response.text, "html.parser")
		course_block = soup.find_all("div", class_="courseBlock")

		all_data = []

		for el in course_block:
			course_code = el.find("span", class_="courseCode").text
			course_title = el.find("span", class_="courseTitle").text
			units = el.find("span", class_="units").text
			section_table = el.find("table", class_="sectionTable")
			if section_table:
				headers = [header.text.strip() for header in section_table.find_all("th")]
				rows = section_table.find_all("tr")[1:]  # Skip the header row

				for row in rows:
					columns = row.find_all(["th" ,"td"])
					row_data = {headers[i]: columns[i].text.strip() for i in range(len(columns))}
					row_data["COURSECODE"] = course_code
					row_data["COURSETITLE"] = course_title
					row_data["Units"] = units
					clean_up = {
						re.sub(r'[^A-Za-z]' ,'' ,key).replace(' ' ,''): value
						for key ,value in row_data.items()
						if not key.startswith('OPEN SEATS')
					}
					all_data.append(clean_up)

		print(all_data)
		return all_data
