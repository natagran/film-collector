(function() {
    'use strict';

    angular
        .module('filmCollector')
        .factory('htmlParser', ['$document', 'lodash', 'config', service]);
        function service($document, _, config) {
        	function retrieveFoldersAndFiles(html) {
                var root = angular.element(html);
                var foldersAndFiles = [];

                var folderItems = root.find(">li.folder");
                _.forEach(folderItems, function(item) {
                    var folder = retrieveFolderInfo(item);
                    foldersAndFiles.push(folder);
                });

                var fileItems = root.find(">li.b-file-new");
                _.forEach(fileItems, function(item) {
                    var file = retrieveFileInfo(item);
                    foldersAndFiles.push(file);
                });

                return foldersAndFiles;
            }

            function retrieveFolderInfo(item) {
                var folder = {};
                folder.type = "folder";
                var a = $(item).find("a.title")[0];
                folder.title = a.text.trim();
                folder.id = /[0-9]+/.exec(a.rel)[0];

                if (item.classList.contains("folder-language"))
                    folder.language = folder.title;

                folder.details = "";
                var detailsSpans = $(item).find(">span.material-details");

                _.forEach(detailsSpans, function(span) {
                    folder.details += span.innerHTML + " ";
                });

                folder.date = $(item).find(">span.material-date")[0].innerHTML;

                return folder;
            }

            function retrieveFileInfo(fileItem) {
                var file = {};
                file.type = "file";

                var qualitySpans = $(fileItem).find("span.video-qulaity");
                if (_.some(qualitySpans))
                    file.quality = qualitySpans[0].innerHTML;

                file.title = "";
                var titleSpan = $(fileItem).find("span.b-file-new__link-material-filename")[0]
                    ||  $(fileItem).find("span.b-file-new__material-filename")[0];
                var titleSpans = $(titleSpan).find("span");

                _.forEach(titleSpans, function(span) {
                    file.title += span.innerHTML.trim() + " ";
                });

                var reference = $(fileItem).find("a.b-file-new__link-material")[0];
                if (reference) {
                    file.reference = config.filmHostUrl + reference.getAttribute("href");
                }

                var downloadReference = $(fileItem).find("a.b-file-new__link-material-download")[0];
                if (downloadReference) {
                    file.downloadReference = config.filmHostUrl + downloadReference.getAttribute("href");
                    file.size = $(fileItem).find("span.b-file-new__link-material-size")[0].innerHTML;
                }

                return file;
            }

        	return {
        		retrieveFoldersAndFiles: retrieveFoldersAndFiles
        	};
        }
})();
