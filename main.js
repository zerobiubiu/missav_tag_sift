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

    // 创建一个新的 script 元素用于引入 jQuery
    // var script = document.createElement('script');
    // script.src = 'https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js';
    // document.body.appendChild(script);

    // 附加搜索组件
    const titleDiv = document.querySelector(
        "body > div:nth-child(2) > div.sm\\:container.mx-auto.px-4.content-without-search.pb-12 > div.flex.justify-between.mb-6"
    ); // 定位
    const newParagraph = newDiv(); // 创建
    titleDiv.insertBefore(newParagraph, titleDiv.firstChild); // 附加

    // 获取最大页数
    function getPageNumbers() {
        // 获取当前分类的最大页码

        for (i = 13; i > 1; i--) {
            endPageNum = document.querySelector(`body > div:nth-child(2) > div.sm\\:container.mx-auto.px-4.content-without-search.pb-12 > nav > div.hidden.md\\:flex-1.md\\:flex.md\\:items-center.md\\:justify-center > span > a:nth-child(${i})`)
            if (endPageNum) {
                nextPageNum = document.querySelector(`body > div:nth-child(2) > div.sm\\:container.mx-auto.px-4.content-without-search.pb-12 > nav > div.hidden.md\\:flex-1.md\\:flex.md\\:items-center.md\\:justify-center > span > a:nth-child(${i - 1})`)
                if (nextPageNum.getAttribute('href') == endPageNum.getAttribute('href')) {
                    return parseInt(nextPageNum.textContent.trim());
                }
                else {
                    return parseInt(endPageNum.textContent.trim());
                }
            }
        }

        return 1;
    }

    async function getTags(pageNum) {
        // 传递页码数量 遍历每个页面中包含的视频链接去解析后返回 tagSet

        var myHeaders = new Headers();
        myHeaders.append("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36");
        myHeaders.append("Accept", "*/*");
        myHeaders.append("Host", "missav.com");
        myHeaders.append("Connection", "keep-alive");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        const tagSet = new Set();

        for (i = 1; i <= pageNum; i++) {
            const response = await fetch(window.location.pathname + `?page=` + i, requestOptions)
                .then(response => response.text())
                .catch(error => console.log('error', error));
            const parser = new DOMParser();
            const doc = parser.parseFromString(response, 'text/html');
            for (i = 12; i > 0; i--) {
                const a = doc.querySelector(`body > div:nth-child(2) > div.sm\\:container.mx-auto.px-4.content-without-search.pb-12 > div.grid.grid-cols-2.md\\:grid-cols-3.xl\\:grid-cols-4.gap-5 > div:nth-child(${i}) > div > div.relative.aspect-w-16.aspect-h-9.rounded.overflow-hidden.shadow-lg > a:nth-child(1)`)
                if (a) {
                    // 将链接传递进行解析后返回 tag 的 Set 集合
                    getPageTag(a.getAttribute('href')).forEach(item => tagSet.add(item));
                } else { continue; }
            }

            console.log(a);
        }

        return tagSet
    }

    function getPageTag(href) {
        // 解析链接的 tag 增加到 tagSet
        const tagSet = new Set();

        return tagSet
    }

    getTags(1);//test
})();
