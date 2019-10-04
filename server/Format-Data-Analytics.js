// How data is returned when asking for analytics

{
  total_visits: "10",
  "continent": [
    {"NA": "5"},
    {"EU" : "5"}
  ],
  "dates": [
    {"Oct 25 2019": "5"},
    {"Oct 26 2019": "5"}
  ]
}


QUERY
// Insert and update
INSERT INTO analytics (slug, visit_date, visits, continent, country, state, city)
VALUES ("000aaa","09-10-2019", "1", "NA", "Canada", "Quebec", "Montreal")
ON DUPLICATE KEY 
UPDATE
visits = visits + 1

// Get total visits
SELECT SUM(visits) FROM analytics WHERE slug="0004c9a"

// Get total visits for each Continent
SELECT SUM(visits) FROM analytics WHERE slug="0004c9a"
UNION
SELECT SUM(b.visits) FROM urls_analytics AS a 
JOIN analytics AS b ON a.urls_slug = b.slug 
WHERE creator_user_id="4ZvPsuc" AND a.urls_slug="0004c9a" AND b.continent="NA"
UNION
SELECT SUM(b.visits) FROM urls_analytics AS a 
JOIN analytics AS b ON a.urls_slug = b.slug 
WHERE creator_user_id="4ZvPsuc" AND a.urls_slug="0004c9a" AND b.continent="EU"

// Get visit date + number of visits in last N days
SELECT b.visit_date, b.visits FROM urls_analytics AS a 
JOIN analytics AS b ON a.urls_slug = b.slug 
WHERE creator_user_id="4ZvPsuc" AND a.urls_slug="0004c9a" AND b.visit_date >= (DATE(NOW()) - INTERVAL 7 DAY)

