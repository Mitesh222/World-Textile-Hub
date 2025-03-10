import requests
import json
import os
import logging
import asyncio
import aiohttp
from datetime import datetime
from bs4 import BeautifulSoup

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# List of reliable RSS feeds for textile reports
RSS_FEEDS = [
    "https://www.fibre2fashion.com/rss/news/textile-news.xml",
    "https://www.textileworld.com/feed/",
    "https://www.itmf.org/rss.xml",
    "https://www.textilevaluechain.in/feed/",
    "https://www.nonwovens-industry.com/rss/news",
    "https://www.technicaltextile.net/rss/news/",
    "https://www.knittingindustry.com/rss/",
    "https://www.ecotextile.com/rss/news/",
    "https://textilefocus.com/feed/",
    "https://www.textiletoday.com.bd/feed/",
    "https://www.textilegence.com/feed/",
    "https://www.sustainabletextile.com/feed/",
    "https://www.yarnsandfibers.com/feed/",
    "https://www.business-standard.com/industry/news/textile/feed",
    "https://www.financialexpress.com/industry/textile/feed",
    "https://www.textilemsme.com/rss/",  # New source for MSME support
    "https://www.plantautomation.com/rss/news/",  # New source for Plant Automation
    "https://www.preownedmachines.com/rss/news/"  # New source for Pre-Owned Machines
]

# Keywords to categorize reports
CATEGORIES = {
    "Industry Trends & Market Analysis": ["market", "growth", "trends", "expansion", "export", "trade policy"],
    "Sustainability & Compliance": ["sustainability", "compliance", "regulations", "eco-friendly", "standards", "carbon footprint"],
    "Technology & Innovation": ["automation", "AI", "smart textiles", "innovation", "digitalization", "robotics"],
    "MSME Support & Growth Strategies": ["MSME", "funding", "investment", "development", "textile policy", "government incentives", "PLI Scheme"],
    "Case Studies & Best Practices": ["case study", "success story", "challenges", "solutions", "benchmarking", "best practices"]
}

# Keywords to prioritize Indian reports
INDIA_KEYWORDS = {"India", "Indian textiles", "sustainable India", "exports", "MSME", "Make in India", "BIS", "Government", "PLI Scheme", "Indian textile parks", "Textile MSME policies", "Government incentives"}

# Local file to store reports
REPORTS_FILE = "reports.json"
MAX_REPORTS_PER_CATEGORY = 100  # Configurable setting

# Function to fetch and parse a single RSS feed asynchronously
async def fetch_feed(feed, session):
    reports = []
    try:
        async with session.get(feed, timeout=10) as response:
            response.raise_for_status()
            content = await response.text()
            soup = BeautifulSoup(content, "xml")
            items = soup.findAll("item")

            for item in items[:2]:  # Fetch 2 reports per source to ensure diversity
                description = item.description.text if item.description else "No summary available."
                report = {
                    "title": item.title.text,
                    "link": item.link.text,
                    "date": item.pubDate.text if item.pubDate else datetime.now().strftime('%Y-%m-%d'),
                    "summary": description[:250] + "...",
                    "source": feed
                }
                reports.append(report)
    except Exception as e:
        logging.error(f"Error fetching from {feed}: {e}")
    return reports

# Function to fetch and categorize reports from all RSS feeds asynchronously
async def fetch_rss_reports():
    reports = {category: [] for category in CATEGORIES.keys()}
    india_reports = []
    seen_titles = set()
    
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_feed(feed, session) for feed in RSS_FEEDS]
        results = await asyncio.gather(*tasks)
    
    for feed_reports in results:
        for report in feed_reports:
            title_lower = report["title"].lower()
            summary_lower = report["summary"].lower()
            
            if title_lower in seen_titles:
                continue  # Skip duplicates
            seen_titles.add(title_lower)

            for category, keywords in CATEGORIES.items():
                if any(keyword.lower() in title_lower or keyword.lower() in summary_lower for keyword in keywords):
                    reports[category].append(report)
                    break
            if any(keyword.lower() in title_lower or keyword.lower() in summary_lower for keyword in INDIA_KEYWORDS):
                india_reports.append(report)
    
    # Prioritize India-focused reports in MSME & Sustainability
    for category in ["MSME Support & Growth Strategies", "Sustainability & Compliance"]:
        reports[category] = india_reports[:8] + reports[category][:4]
    
    return reports

# Function to save reports locally
def save_reports(reports):
    existing_reports = {}
    
    if os.path.exists(REPORTS_FILE):
        with open(REPORTS_FILE, "r", encoding="utf-8") as file:
            existing_reports = json.load(file)
    
    # Keep only the latest reports per category
    for category in reports.keys():
        all_reports = reports[category] + existing_reports.get(category, [])
        existing_reports[category] = all_reports[:MAX_REPORTS_PER_CATEGORY]
    
    with open(REPORTS_FILE, "w", encoding="utf-8") as file:
        json.dump(existing_reports, file, indent=4)
    
    logging.info("Reports saved successfully.")

# Run the script
def main():
    logging.info("Fetching latest textile reports...")
    new_reports = asyncio.run(fetch_rss_reports())
    
    if new_reports:
        save_reports(new_reports)
        logging.info("Reports fetching and saving completed successfully.")
    else:
        logging.warning("No new reports found.")

if __name__ == "__main__":
    main()
