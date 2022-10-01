// ==UserScript==
// @name     Filter AngelList Job Results
// @version  1
// @grant    none
// @include  https://angel.co/jobs
// ==/UserScript==

// current angel list filters work with descriptions of job and company, I just want to filter out titles with keywords

/**
 * return boolean value of whether job title matches listed
 */
function checkJobTitle(jobListing, targetStrings) {
	var jobTitle = jobListing.querySelector(
		'span.styles_title__xpQDw').innerText.toLowerCase();
	for (let i = 0; i < targetStrings.length; i++) {
		if (jobTitle.includes(targetStrings[i])) {
			return true; // a match to one of the target strings exists in title
		}
	}
	return false; // the title contains none of the target keywords
}

/**
 * find all listings, remove them if they match a filter condition
 */
function filterListings(disallowedTerms) {
	var jobListings = document.getElementsByClassName('styles_component__uTjje');
	var numRemoved = 0;
	for (const listing of jobListings) {
		// if listing contains term we don't want in title
		if (checkJobTitle(listing, disallowedTerms)) {
			listing.remove();
			numRemoved++;
		}
	}
	return numRemoved;
}

function runScript() {
  var disallowedTerms = ['senior', 'lead', 'staff', 'frontend', 'test', 'founding',
                        'betting', 'gambling', 'sr.', 'founder'];
  let listingsRemoved = filterListings(disallowedTerms);
  console.log(`Number of job listings removed: ${listingsRemoved}.`);
}


var t=setInterval(runScript,10000); // filter listings every 10 seconds
