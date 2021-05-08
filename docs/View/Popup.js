class Popup {
    constructor() {
        this.preloaderBar = '<div class="progress">' +
            'zapisuję...<div class="indeterminate"></div>' +
            '</div>';


        this.loadingWheel = '<article>Ładuję dane...</article>' +
            '<div class="preloader-wrapper big active">' +
            '<div class="spinner-layer spinner-green-only">' +
            '<div class="circle-clipper left">' +
            '<div class="circle"></div>' +
            '</div><div class="gap-patch">' +
            '<div class="circle"></div>' +
            '</div><div class="circle-clipper right">' +
            '<div class="circle"></div>' +
            '</div>' +
            '</div>' +
            '</div>';
    }

    showLoadingWheel(HTMLElement) {
        $(HTMLElement).append(this.loadingWheel);
    }

    showPreloader(HTMLElement) {
        $(HTMLElement).append(this.preloaderBar);
    }

    hidePreloader(HTMLElement) {
        $(HTMLElement).remove();
    }

    setTittle(title) {
        $("#title").html("<H4>" + title + "</h4>");
    }

    makeSubTittle(title) {
        return $("<H5>" + title + "</h5>");
    }

    setStatus(message) {
        $("#status").append("<p>" + message + "</p>");
    }

    setForm() {

    }

    dataLoaded(loaded) {
        if (loaded) {
            $("#loading").hide();
            $("#content").show();
        }
        else {
            $("#content").hide();
            $("#loading").append(this.loadingWheel);
            $("#loading").show();
        }
    }

    loadIframe(iframeName, url) {
        var $iframe = $('#' + iframeName);
        if ($iframe.length) {
            $iframe.attr('src', url);
            return false;
        }
        return true;
    }
}

