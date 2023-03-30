// ==UserScript==
// @name     Filter Job Results
// @version  1.1
// @grant    none
// @include  https://angel.co/jobs
// @include  https://wellfound.com/jobs
// @include  https://www.linkedin.com/jobs/search/*
// ==/UserScript==

// current angel list filters work with descriptions of job and company, I just want to filter out titles with keywords

/**
 * return boolean value of whether job title matches listed
 */
function checkJobTitle(jobListing, targetStrings) {
	if (isAngelList()) { // angellist job search
		var jobTitle = jobListing.querySelector(
			'span.styles_title__xpQDw').innerText.toLowerCase();
	} else { // linkedin job search
		var jobTitle = jobListing.querySelector(
			'a.job-card-list__title').innerText.toLowerCase();
	}
	for (let i = 0; i < targetStrings.length; i++) {
		if (jobTitle.includes(targetStrings[i])) {
			return true; // a match to one of the target strings exists in title
		}
	}
	return false; // the title contains none of the target keywords
}

/**
 * return boolean value of whether job details match listed
 */
function checkJobDescription(jobListing, targetStrings) {
	var jobLocationInfo = jobListing.querySelectorAll(
		'span.styles_location__O9Z62');
	for (let i=0; i < targetStrings.length; i++) {
		for (let j=0; j < jobLocationInfo.length; j++) {
			if (jobLocationInfo[j].innerText.toLowerCase().includes(targetStrings[i])) {
				return true; // a match to one of the target strings exists in desc
			}
		}
	}
	return false; // the desc contains none of the target keywords
}

/**
 * find all listings, remove them if they match a filter condition
 */
function filterListings(disallowedTerms) {
	if (isAngelList()) { // angellist job search
		var jobListings = document.getElementsByClassName('styles_component__uTjje');
	} else { // linkedin job search
		var jobsContainer = document.querySelector(
			'div[data-test="JobSearchResults"]');
		// var jobListings = jobsContainer.getElementsByClassName(
		// 	'styles_component__uTjje');
		var jobListings = jobsContainer.querySelectorAll(
			'div[data-test="StartupResult"]');
	}
	var numRemoved = 0;
	for (const listing of jobListings) {
		// if listing contains term we don't want in title
		if (checkJobTitle(listing, disallowedTerms)) {
			listing.remove();
			numRemoved++;
		} // only runs for AngelList, because we can't see job desc from linkedin preview
		else if (isAngelList() && checkJobDescription(listing, disallowedTerms)) {
			listing.remove();
			numRemoved++;
		}
	}
	return numRemoved;
}

/**
 * return boolean of whether current site is angel list (false being linkedin)
 */
function isAngelList() {
	if (window.location.href.includes("wellfound.com/jobs")) { // angellist job search
		return true;
	} else { // linkedin job search
		return false;
	}
}

function runScript() {
	var disallowedTerms = ['senior', 'lead', 'staff', 'frontend', 'test', 'founding',
		'betting', 'gambling', 'sr.', 'founder', 'in office', 'sr '];
	// would like to pass enum of current site, but I think I'll need to switch to TS(?) for that
	let listingsRemoved = filterListings(disallowedTerms);
	console.log(`Number of job listings removed: ${listingsRemoved}.`);
	// lower the rate of removal if we remove nothing for a while
	// if (listingsRemoved === 0) {
	// 	numPaused++; // keep track of how long we haven't removed any listings for
	// 	if (150 > numPaused > 30) {
	// 		frequency = 10000; // update frequency to once every ten seconds
	// 	} else if (numPaused > 150) {
	// 		frequency = 9000000; // update frequency to run once every 9000 seconds
	// 	}
	// } else {
	// 	numPaused = 0; // reset pause timer to zero, since we had movement again
	// }
}

// var numPaused = 0; // how many iterations the script hasn't removed any listings
var frequency = 1000; // how often the script removes listing
var t = setInterval(runScript, frequency); // filter listings every 10 seconds

// var counter = 10;
// var reRunner = function() {
//     runScript();
//     setTimeout(reRunner, counter);
// }
// setTimeout(reRunner, counter);

