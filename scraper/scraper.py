import urllib.request
import bs4
from bs4 import BeautifulSoup as soup

# bypasses Error 403 block
user_agent = 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.7) Gecko/2009021910 Firefox/3.0.7'

# references
my_url = "https://mlh.io/seasons/na-2020/events"
headers = {'User-Agent':user_agent,} 

# don't touch
request = urllib.request.Request(my_url,None,headers) 
UClient = urllib.request.urlopen(request)

filename = "hackathons.csv"
f = open(filename,"w")
header = "Hackathon_Name,High_School,Start_Year,Start_Month,Start_Day,End_Year,End_Month,End_Day,Locality,Region,URL\n"
f.write(header)

# reads page, spits out soup
page_html = UClient.read()
UClient.close()
page_soup = soup(page_html, "html.parser")

# grabs each event
events = page_soup.findAll("div",{"class":"event-wrapper"})

for event in events:
    # finds and prints every name
    name_container = event.findAll("h3",{"itemprop":"name"})
    name = name_container[0].text.strip()
    #print(name)

    # finds and prints the start date
    startDate_container = event.findAll("meta",{"itemprop":"startDate"})
    startDate = startDate_container[0].attrs['content']
    startYear,startMonth,startDay = startDate.split("-")
    #print(startYear + " " + startMonth + " " + startDay)

    # finds and prints the locality
    localityContainer = event.findAll("span",{"itemprop":"city"})
    locality = localityContainer[0].text.strip()
    #print(locality)

    # finds and prints the region
    regionContainer = event.findAll("span",{"itemprop":"state"})
    region = regionContainer[0].text.strip()
    #print(region)

    #finds and prints the url
    url = event.a["href"]
    #print(url)

    # finds and prints the start date
    endDate_container = event.findAll("meta",{"itemprop":"endDate"})
    endDate = endDate_container[0].attrs['content']
    endYear,endMonth,endDay = endDate.split("-")
    #print(endYear + " " + endMonth + " " + endDay)

    if event.div.div.div != None:
        highSchool = 1
    else:
        highSchool = 0

    f.write(name + "," + str(highSchool) + "," + startYear + "," + startMonth + "," + startDay + "," + endYear + "," + endMonth + "," + \
            endDay + "," + locality + "," + region + "," + url + "\n")

print("Scrape done successfully")  

f.close()
