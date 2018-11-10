import urllib.request
import bs4
from bs4 import BeautifulSoup as soup

# bypasses Error 403 block
user_agent = 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.7) Gecko/2009021910 Firefox/3.0.7'

# references
my_url = "https://mlh.io/seasons/na-2019/events"
headers = {'User-Agent':user_agent,} 

# don't touch
request = urllib.request.Request(my_url,None,headers) 
UClient = urllib.request.urlopen(request)

#reads page, spits out soup
page_html = UClient.read() 
UClient.close()
page_soup = soup(page_html, "html.parser")
print(page_soup.h1)
