// ==UserScript==
// @name         111
// @namespace    111
// @version      1.0
// @description  111
// @author       You
// @match        https://missav.com/dm*
// @grant        none
// ==/UserScript==

(function () {
    function newDiv() {
        const newParagraph = document.createElement('div');
        newParagraph.innerHTML = `
        <button type="button" class="btn btn-secondary" data-bs-toggle="dropdown" aria-expanded="false"
            data-bs-auto-close="outside">
            筛选
        </button>
        <form class="dropdown-menu dropdown-menu-dark p-3">
            <div style="width: 300px;" class="d-flex flex-wrap">

                <div class="form-check m-2">
                    <label class="form-check-label">
                        <input type="checkbox" class="form-check-input" id="dropdownCheck1">
                        选项
                    </label>
                </div>

                <div class="form-check m-2">
                    <label class="form-check-label">
                        <input type="checkbox" class="form-check-input" id="dropdownCheck1">
                        选项
                    </label>
                </div>

                <div class="form-check m-2">
                    <label class="form-check-label">
                        <input type="checkbox" class="form-check-input" id="dropdownCheck1">
                        选项
                    </label>
                </div>

            </div>

            <div class="d-flex justify-content-end">
                <button type="submit" class="btn btn-primary" id="tag-search-but">搜索</button>
            </div>
        </form>`
        newParagraph.className = 'dropdown'

        return newParagraph
    }

    // 创建一个新的 link 元素用于引入 Bootstrap CSS
    var link = document.createElement('link');
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // 创建一个新的 script 元素用于引入 Bootstrap JavaScript
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js';
    document.body.appendChild(script);

    // 附加搜索组件
    const titleDiv = document.querySelector(
        "body > div:nth-child(2) > div.sm\\:container.mx-auto.px-4.content-without-search.pb-12 > div.flex.justify-between.mb-6"
    ); // 定位
    const newParagraph = newDiv(); // 创建
    titleDiv.insertBefore(newParagraph, titleDiv.firstChild); // 附加

    function getPageNumbers() {
        for (i = 13; i > 1; i--) {
            endPageNum = document.querySelector(`body > div:nth-child(2) > div.sm\\:container.mx-auto.px-4.content-without-search.pb-12 > nav > div.hidden.md\\:flex-1.md\\:flex.md\\:items-center.md\\:justify-center > span > a:nth-child(${i})`)
            if (endPageNum) {
                nextPageNum = document.querySelector(`body > div:nth-child(2) > div.sm\\:container.mx-auto.px-4.content-without-search.pb-12 > nav > div.hidden.md\\:flex-1.md\\:flex.md\\:items-center.md\\:justify-center > span > a:nth-child(${i-1})`)
                if (nextPageNum.getAttribute('href')==endPageNum.getAttribute('href')){
                    console.log(nextPageNum.getAttribute('href'))
                    console.log(endPageNum.getAttribute('href'))
                    return parseInt(nextPageNum.textContent.trim());
                }
                else{
                    return parseInt(endPageNum.textContent.trim());
                }
            }
        }
    }
    console.log(getPageNumbers())
})();