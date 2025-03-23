document.addEventListener("DOMContentLoaded", function () {
  const newsSearch = document.getElementById("newsSearch");
  const newsFilter = document.getElementById("newsFilter");
  const newsContainer = document.getElementById("news-container");

  if (!newsSearch || !newsFilter || !newsContainer) {
    console.error("Error: Required elements (newsSearch, newsFilter, newsContainer) are missing in HTML.");
    return;
  }

  // Make newsData accessible globally for debugging
  window.newsData = [];

  async function fetchNews() {
    try {
      const response = await fetch("news.json");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();

      // Check if data is an array or object
      if (Array.isArray(data)) {
        window.newsData = data;
      } else if (data.news && Array.isArray(data.news)) {
        window.newsData = data.news;
      } else {
        throw new Error("Invalid JSON structure. Expected array or { news: [...] }");
      }

      console.log("✅ Fetched newsData:", window.newsData);
      populateCategories();
      renderNews(window.newsData);
    } catch (error) {
      console.error("❌ Error fetching news:", error);
    }
  }

  function populateCategories() {
    const categories = [...new Set(window.newsData.map(item => item.category.trim()))];
    const dropdownOptions = ["All Categories", ...categories];

    newsFilter.innerHTML = dropdownOptions.map(category =>
      `<option value="${category}">${category}</option>`).join('');
  }

  function filterNews() {
    const selectedCategory = newsFilter.value.trim();
    const searchQuery = newsSearch.value.toLowerCase().trim();

    const filteredNews = window.newsData.filter(item => {
      const categoryMatch = selectedCategory === "All Categories" || item.category.trim() === selectedCategory;
      const searchMatch = item.title.toLowerCase().includes(searchQuery);
      return categoryMatch && searchMatch;
    });

    console.log("🔎 Filtered news:", filteredNews);
    renderNews(filteredNews);
  }

  function renderNews(newsArray) {
    newsContainer.innerHTML = "";

    if (newsArray.length === 0) {
      newsContainer.innerHTML = "<p>No news articles found.</p>";
      return;
    }

    newsArray.forEach(news => {
      const card = document.createElement("div");
      card.className = "news-card";

      const title = document.createElement("h3");
      title.textContent = news.title;

      const category = document.createElement("p");
      category.className = "news-category";
      category.textContent = `Category: ${news.category || "Uncategorized"}`;

      const date = document.createElement("p");
      date.className = "news-date";
      date.textContent = `Published on: ${news.date || "Unknown Date"}`;

      const summary = document.createElement("p");
      summary.textContent = news.summary || "No summary available.";

      const readMore = document.createElement("a");
      readMore.href = news.link;
      readMore.textContent = "Read More";
      readMore.className = "read-more";
      readMore.target = "_blank";

      card.appendChild(title);
      card.appendChild(category);
      card.appendChild(date);
      card.appendChild(summary);
      card.appendChild(readMore);
      newsContainer.appendChild(card);
    });
  }

  // Event listeners
  newsFilter.addEventListener("change", filterNews);
  newsSearch.addEventListener("keyup", filterNews);

  fetchNews(); // Load news on page load
});
