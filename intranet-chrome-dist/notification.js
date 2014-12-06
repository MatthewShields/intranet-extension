var returnedTitle;
var returnedUrl;
var returnedExcerpt;

var commentReturnedTitle = 'New Comment Notification';
var commentReturnedUrl;
var commentReturnedExcerpt;

var intranetHomepage = 'http://intranet.stickyeyes.com/';
var notificationPage = 'http://intranet.stickyeyes.com/notifications/';
var minuteInterval = 5;

var connected = false;

function fetch_feed() {
    
    $.ajax({
        url: notificationPage,
        type: "GET",
        dataType: "html",
        success: function(data){
            connected = true;
            chrome.browserAction.setIcon({
                path: 'logo.png'
            });

            if($(data).find('.feed-single').length > 0) {
                $(data).find('.feed-single').each(function() {
                    returnedTitle = $(this).find('.title').text();
                    returnedUrl = $(this).find('.permalink').text();
                    returnedExcerpt = $(this).find('.excerpt').text();
                    returnedExcerpt = returnedExcerpt.substring(0, 60);

                    notifyMe(returnedTitle, returnedExcerpt, returnedUrl);
                });
            }

            if($(data).find('.notification').length > 0) {
                $(data).find('.notification').each(function() {
                    commentReturnedUrl = $(this).find('.permalink').text();
                    commentReturnedExcerpt = $(this).find('.title').text();
                    commentReturnedExcerpt = commentReturnedExcerpt.substring(0, 60);

                    notifyMe(commentReturnedTitle, commentReturnedExcerpt, commentReturnedUrl);
                });
            }
        },
        error: function() { 
            connected = false;
            chrome.browserAction.setIcon({
                path: 'logo-fail.png'
            });
        } 
    });
}

function notifyMe(title, excerpt, url) {
    var opt = {
       type: "basic",
       title: title,
       message: excerpt,
       iconUrl: "logo-white-bg.jpg"
    };
    chrome.notifications.create(url, opt, function(id) {
        chrome.browserAction.setBadgeText({ text: "New" });
    });

}

chrome.browserAction.onClicked.addListener(function(tab) {
    if(connected == true) {
        chrome.tabs.create({url: intranetHomepage});
        chrome.browserAction.setBadgeText({ text: "" });
    }
});

chrome.notifications.onClicked.addListener(function(id, byUser) {
    chrome.tabs.create({url: id});
    chrome.browserAction.setBadgeText({ text: "" });
    chrome.windows.getCurrent(function(win) {
        chrome.windows.update(win.id, {focused: true});
    });
});


fetch_feed();

setInterval( fetch_feed, minuteInterval*60*1000 );

