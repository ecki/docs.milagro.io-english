
/*
Tipue Search 5.0
Copyright (c) 2015 Tipue
Tipue Search is released under the MIT License
http://www.tipue.com/search
*/


/*
Stop words
Stop words list from http://www.ranks.nl/stopwords
*/

var tipuesearch_stop_words = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"];


// Word replace

var tipuesearch_replace = {'words': [
     {'word': 'tipua', 'replace_with': 'tipue'},
     {'word': 'javscript', 'replace_with': 'javascript'},
     {'word': 'sub-directory', 'replace_with': 'subdirectory'},
     {'word': 'sub-folder', 'replace_with': 'subdirectory'},
     {'word': 'subfolder', 'replace_with': 'subdirectory'},
     {'word': 'jqeury', 'replace_with': 'jquery'}
]};


// Pages to index
var tipuesearch_pages = [
  "http://docs.milagro.io/en/amcl/index.html",
  "http://docs.milagro.io/en/amcl/mclwp.html",
  "http://docs.milagro.io/en/amcl/milagro-crypto-library-api-reference.html",
  "http://docs.milagro.io/en/amcl/milagro-crypto-library-benchmarks-old.html",
  "http://docs.milagro.io/en/amcl/milagro-crypto-library-benchmarks.html",
  "http://docs.milagro.io/en/amcl/milagro-crypto-library-developer-guide.html",
  "http://docs.milagro.io/en/amcl/milagro-crypto-library-white-paper.html",
  "http://docs.milagro.io/en/distributed-trust.html",
  "http://docs.milagro.io/en/index.html",
  "http://docs.milagro.io/en/index2.html",
  "http://docs.milagro.io/en/integration/milagro-mfa-integration-apache-web-server.html",
  "http://docs.milagro.io/en/integration/milagro-mfa-integration-examples.html",
  "http://docs.milagro.io/en/integration/milagro-mfa-integration-pin-pad.html",
  "http://docs.milagro.io/en/integration/milagro-mfa-integration-username-pin.html",
  "http://docs.milagro.io/en/manual/alerts.html",
  "http://docs.milagro.io/en/manual/backups.html",
  "http://docs.milagro.io/en/manual/custom-fields.html",
  "http://docs.milagro.io/en/manual/importing-assets.html",
  "http://docs.milagro.io/en/manual/importing-licenses.html",
  "http://docs.milagro.io/en/manual/index.html",
  "http://docs.milagro.io/en/manual/labels.html",
  "http://docs.milagro.io/en/manual/user-management/index.html",
  "http://docs.milagro.io/en/mfa/configuration/milagro-mfa-api-reference.html",
  "http://docs.milagro.io/en/mfa/configuration/milagro-mfa-configuration.html",
  "http://docs.milagro.io/en/mfa/configuration/milagro-mfa-d-ta-configuration.html",
  "http://docs.milagro.io/en/mfa/configuration/milagro-mfa-enabling-html5.html",
  "http://docs.milagro.io/en/mfa/configuration/milagro-mfa-enabling-native-apps.html",
  "http://docs.milagro.io/en/mfa/configuration/milagro-mfa-integrating-pinpad.html",
  "http://docs.milagro.io/en/mfa/configuration/milagro-mfa-logging-services.html",
  "http://docs.milagro.io/en/mfa/configuration/milagro-mfa-manually-applying-server-secrets.html",
  "http://docs.milagro.io/en/mfa/configuration/milagro-mfa-rps-configuration.html",
  "http://docs.milagro.io/en/mfa/getting-started/milagro-mfa-configuring-ssl.html",
  "http://docs.milagro.io/en/mfa/getting-started/milagro-mfa-developer-guide.html",
  "http://docs.milagro.io/en/mfa/getting-started/milagro-mfa-email-verification.html",
  "http://docs.milagro.io/en/mfa/getting-started/milagro-mfa-overview.html",
  "http://docs.milagro.io/en/mfa/getting-started/milagro-mfa-system-requirements.html",
  "http://docs.milagro.io/en/mfa/integration/milagro-mfa-integration-apache-web-server.html",
  "http://docs.milagro.io/en/mfa/integration/milagro-mfa-integration-examples.html",
  "http://docs.milagro.io/en/mfa/integration/milagro-mfa-integration-pin-pad.html",
  "http://docs.milagro.io/en/mfa/integration/milagro-mfa-integration-username-pin.html",
  "http://docs.milagro.io/en/mfa/javascript/milagro-mfa-javascript-guide.html",
  "http://docs.milagro.io/en/mfa/manual/milagro-mfa-mobile-apps.html",
  "http://docs.milagro.io/en/mfa/manual/milagro-mfa-with-javascript-browser-client-pin-pad.html",
  "http://docs.milagro.io/en/mfa/manual/milagro-mfa-with-javascript-browser-client-username-pin.html",
  "http://docs.milagro.io/en/mfa/mobile-apps/milgaro-mfa-mobile-apps-adding-configurations-from-qr-code.html",
  "http://docs.milagro.io/en/mfa/mobile-apps/milgaro-mfa-mobile-apps-adding-configurations-manually.html",
  "http://docs.milagro.io/en/mfa/mobile-apps/milgaro-mfa-mobile-apps-adding-custom-configurations.html",
  "http://docs.milagro.io/en/mfa/mobile-apps/milgaro-mfa-mobile-apps-generating-one-time-passwords.html",
  "http://docs.milagro.io/en/mfa/mobile-apps/milgaro-mfa-mobile-apps-managing-identities.html",
  "http://docs.milagro.io/en/mfa/mobile-apps/milgaro-mfa-mobile-apps-overview.html",
  "http://docs.milagro.io/en/mfa/mobile-apps/milgaro-mfa-mobile-apps-registering-authenticating.html",
  "http://docs.milagro.io/en/mfa/mobile-apps/milgaro-mfa-mobile-apps-selecting-custom-configurations.html",
  "http://docs.milagro.io/en/mfa/mobile-sdk-android/milagro-mfa-mobile-sdk-api-reference.html",
  "http://docs.milagro.io/en/mfa/mobile-sdk-android/milagro-mfa-mobile-sdk-authentication-methods.html",
  "http://docs.milagro.io/en/mfa/mobile-sdk-android/milagro-mfa-mobile-sdk-building-sdk-app.html",
  "http://docs.milagro.io/en/mfa/mobile-sdk-android/milagro-mfa-mobile-sdk-developer-guide.html",
  "http://docs.milagro.io/en/mfa/mobile-sdk-android/milagro-mfa-mobile-sdk-generic-example.html",
  "http://docs.milagro.io/en/mfa/mobile-sdk-android/milagro-mfa-mobile-sdk-init-config-methods.html",
  "http://docs.milagro.io/en/mfa/mobile-sdk-android/milagro-mfa-mobile-sdk-registration-methods.html",
  "http://docs.milagro.io/en/mfa/mobile-sdk-android/milagro-mfa-mobile-sdk-user-management-methods.html",
  "http://docs.milagro.io/en/mfa/mobile-sdk-android/milagro-mfa-mobile-sdk-user-states.html",
  "http://docs.milagro.io/en/mfa/mobile-sdk-ios/milagro-mfa-mobile-sdk-api-reference.html",
  "http://docs.milagro.io/en/mfa/mobile-sdk-ios/milagro-mfa-mobile-sdk-authentication-methods.html",
  "http://docs.milagro.io/en/mfa/mobile-sdk-ios/milagro-mfa-mobile-sdk-building-sdk-app.html",
  "http://docs.milagro.io/en/mfa/mobile-sdk-ios/milagro-mfa-mobile-sdk-developer-guide.html",
  "http://docs.milagro.io/en/mfa/mobile-sdk-ios/milagro-mfa-mobile-sdk-generic-example.html",
  "http://docs.milagro.io/en/mfa/mobile-sdk-ios/milagro-mfa-mobile-sdk-init-config-methods.html",
  "http://docs.milagro.io/en/mfa/mobile-sdk-ios/milagro-mfa-mobile-sdk-registration-methods.html",
  "http://docs.milagro.io/en/mfa/mobile-sdk-ios/milagro-mfa-mobile-sdk-user-management-methods.html",
  "http://docs.milagro.io/en/mfa/mobile-sdk-ios/milagro-mfa-mobile-sdk-user-states.html",
  "http://docs.milagro.io/en/mfa/mobile-sdk-wp/milagro-mfa-mobile-sdk-api-reference.html",
  "http://docs.milagro.io/en/mfa/mobile-sdk-wp/milagro-mfa-mobile-sdk-authentication-methods.html",
  "http://docs.milagro.io/en/mfa/mobile-sdk-wp/milagro-mfa-mobile-sdk-building-sdk-app.html",
  "http://docs.milagro.io/en/mfa/mobile-sdk-wp/milagro-mfa-mobile-sdk-developer-guide.html",
  "http://docs.milagro.io/en/mfa/mobile-sdk-wp/milagro-mfa-mobile-sdk-generic-example.html",
  "http://docs.milagro.io/en/mfa/mobile-sdk-wp/milagro-mfa-mobile-sdk-init-config-methods.html",
  "http://docs.milagro.io/en/mfa/mobile-sdk-wp/milagro-mfa-mobile-sdk-registration-methods.html",
  "http://docs.milagro.io/en/mfa/mobile-sdk-wp/milagro-mfa-mobile-sdk-user-management-methods.html",
  "http://docs.milagro.io/en/mfa/mobile-sdk-wp/milagro-mfa-mobile-sdk-user-states.html",
  "http://docs.milagro.io/en/milagro-a-case-for-something-new-part-1.html",
  "http://docs.milagro.io/en/milagro-a-case-for-something-new-part-2.html",
  "http://docs.milagro.io/en/milagro-concepts.html",
  "http://docs.milagro.io/en/milagro-distributed-trust-proposal.html",
  "http://docs.milagro.io/en/milagro-roadmap.html",
  "http://docs.milagro.io/en/pairing-crypto-protocols.html",
  "http://docs.milagro.io/en/pairing-cryptography-intro.html",
  "http://docs.milagro.io/en/Project-Lifecycle.html",
  "http://docs.milagro.io/en/tls/milagro-tls-library-api-reference.html",
  "http://docs.milagro.io/en/tls/milagro-tls-library-benchmarks.html",
  "http://docs.milagro.io/en/tls/milagro-tls-library-developer-guide.html",
  "http://docs.milagro.io/en/tls/milagro-tls-library-white-paper-orig.html",
  "http://docs.milagro.io/en/tls/milagro-tls-library-white-paper.html",
];



// Weighting

var tipuesearch_weight = {'weight': [
     {'url': 'http://docs.snipeitapp.com/index.html', 'score': 100},
     {'url': 'http://docs.snipeitapp.com/index.html', 'score': 100},
     {'url': 'http://docs.snipeitapp.com/requirements.html', 'score': 100}
]};


// Stemming

var tipuesearch_stem = {'words': [
     {'word': 'e-mail', 'stem': 'email'},
     {'word': 'javascript', 'stem': 'jquery'},
     {'word': 'un-suspend', 'stem': 'unsuspend'},
     {'word': 'javascript', 'stem': 'js'}
]};


// Internal strings

var tipuesearch_string_1 = 'No title';
var tipuesearch_string_2 = 'Showing results for';
var tipuesearch_string_3 = 'Search instead for';
var tipuesearch_string_4 = '1 result';
var tipuesearch_string_5 = 'results';
var tipuesearch_string_6 = 'Prev';
var tipuesearch_string_7 = 'Next';
var tipuesearch_string_8 = 'Nothing found';
var tipuesearch_string_9 = 'Common words are largely ignored';
var tipuesearch_string_10 = 'Search too short';
var tipuesearch_string_11 = 'Should be one character or more';
var tipuesearch_string_12 = 'Should be';
var tipuesearch_string_13 = 'characters or more';
