document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    
    const newsTitle = decodeURIComponent(params.get("title") || "No Title");
    const newsSummary = decodeURIComponent(params.get("summary") || "No Summary Available");
    const newsDate = params.get("date") || "Unknown Date";
    const newsSource = params.get("source") || "#";

    document.getElementById("news-title").innerText = newsTitle;
    document.getElementById("news-summary").innerText = newsSummary;
    document.getElementById("news-date").innerText = newsDate;

    let sourceLink = document.getElementById("news-source");
    sourceLink.href = newsSource;
});
