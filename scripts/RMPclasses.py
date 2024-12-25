import json
import math
from bs4 import BeautifulSoup
import requests

class RateMyProfScraper:
	def __init__(self,school_id):
		self.combined_url = f"https://www.ratemyprofessors.com/search/professors/{school_id}"

	def getProfessor(self, prof_name):
		response = requests.get(self.combined_url+f"?q={prof_name}")
		soup = BeautifulSoup(response.text, "html.parser")
		get_teacher_card = soup.find_all("a", {"class": "TeacherCard__StyledTeacherCard-syjs0d-0 dLJIlx"})

		for el in get_teacher_card[:1]:
			professor_name = el.find("div", class_ ="CardName__StyledCardName-sc-1gyrgim-0")
			department = el.find("div", class_="CardSchool__Department-sc-19lmz2k-0")
			level_of_difficulty=el.find("div", class_="CardFeedback__CardFeedbackItem-lq6nix-1")

			quality = el.find("div", class_="CardNumRating__CardNumRatingNumber-sc-17t4b9u-2")
			print(quality.text)
			num_of_ratings = el.find("div", class_="CardNumRating__CardNumRatingCount-sc-17t4b9u-3")

			res = {
					"ProfessorName": professor_name.text,
					"Department": department.text ,
					"level_of_difficulty": level_of_difficulty.text ,
					"Quality": quality.text ,
					"num_of_ratings": num_of_ratings.text
				}
		return res

# c = RateMyProfScraper(school_id=18846)
#
# c.getProfessor(prof_name="David Brown")