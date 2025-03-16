document.addEventListener("DOMContentLoaded", () => {
    fetch('news.json')
        .then(response => response.json())
        .then(data => renderCategorizedNews(data))
        .catch(error => {
            console.error("Error fetching news:", error);
            document.getElementById("news-container").innerHTML = "<p>Error loading news.</p>";
        });
});

function renderCategorizedNews(categorizedData) {
    const container = document.getElementById("news-container");
    container.innerHTML = ""; // Clear existing

    for (const category in categorizedData) {
        const newsList = categorizedData[category];
        if (newsList.length === 0) continue;

        const categoryHeader = document.createElement("h2");
        categoryHeader.textContent = category;
        categoryHeader.classList.add("category-header");
        container.appendChild(categoryHeader);

        const categorySection = document.createElement("div");
        categorySection.classList.add("news-category-section");

        newsList.forEach(news => {
            const card = document.createElement("div");
            card.classList.add("news-card");

            const title = document.createElement("h3");
            title.textContent = news.title;

            const summary = document.createElement("p");
            summary.textContent = news.summary;

            const source = document.createElement("small");
            source.textContent = `Source: ${news.source}`;

            const date = document.createElement("small");
            date.textContent = `Date: ${news.date}`;

            const link = document.createElement("a");
            link.href = news.link;
            link.target = "_blank";
            link.textContent = "Read more";
            link.classList.add("read-more-link");

            card.appendChild(title);
            card.appendChild(summary);
            card.appendChild(source);
            card.appendChild(document.createElement("br"));
            card.appendChild(date);
            card.appendChild(document.createElement("br"));
            card.appendChild(link);

            categorySection.appendChild(card);
        });

        container.appendChild(categorySection);
    }
}
