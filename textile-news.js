function filterNews() {
    console.log("Filter function triggered!");

    const selectedCategory = document.getElementById("newsFilter").value;
    console.log("Selected Category:", selectedCategory);

    const newsContainer = document.getElementById("news-container");
    newsContainer.innerHTML = ""; // Clear existing news

    if (selectedCategory === "all") {
        displayAllNews();
        return;
    }

    if (!newsData[selectedCategory]) {
        console.warn("No news found for this category:", selectedCategory);
        newsContainer.innerHTML = "<p>No results found</p>";
        return;
    }

    const filteredNews = newsData[selectedCategory];

    console.log("Filtered News:", filteredNews);

    if (filteredNews.length === 0) {
        newsContainer.innerHTML = "<p>No results found</p>";
    } else {
        filteredNews.forEach(news => {
            newsContainer.innerHTML += `<div class="news-item"><h3>${news.title}</h3><p>${news.content}</p></div>`;
        });
    }
}
