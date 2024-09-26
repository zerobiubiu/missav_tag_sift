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
    // 添加外部库
    {
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
    }

    // 创建一个筛选组件
    function newFilterComponent() {
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
        newParagraph.setAttribute('id', 'filterComponent-dropdown-fcd');

        return newParagraph
    }

    // 创建筛选组件 DOM
    const FilterComponent = newFilterComponent();

    // 附加筛选组件
    {
        // 定位附加 DOM
        const titleDiv = document.querySelector(
            "body > div:nth-child(2) > div.sm\\:container.mx-auto.px-4.content-without-search.pb-12 > div.flex.justify-between.mb-6"
        );

        // 判断是否定位到 DOM
        if (titleDiv) {
            // 附加在 DOM 的第一个
            titleDiv.insertBefore(FilterComponent, titleDiv.firstChild);
        }
    }

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

    // 获取每个页面的所有链接并解析标签
    async function getTags(pageNum) {
        const tagSet = new Set();
        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
            "Accept": "*/*",
            "Host": "missav.com",
            "Connection": "keep-alive"
        };

        const requestOptions = {
            method: 'GET',
            headers: headers,
            redirect: 'follow'
        };

        for (let i = 1; i <= pageNum; i++) {
            try {
                const response = await fetch(window.location.pathname + `?page=` + i, requestOptions)
                    .then(response => response.text())
                    .catch(error => console.log('error', error));
                const parser = new DOMParser();
                const doc = parser.parseFromString(response, 'text/html');

                for (let j = 12; j > 0; j--) {
                    const a = doc.querySelector(`body > div:nth-child(2) > div.sm\\:container.mx-auto.px-4.content-without-search.pb-12 > div.grid.grid-cols-2.md\\:grid-cols-3.xl\\:grid-cols-4.gap-5 > div:nth-child(${j}) > div > div.relative.aspect-w-16.aspect-h-9.rounded.overflow-hidden.shadow-lg > a:nth-child(1)`);
                    if (a) {
                        const pageTags = await getPageTag(a.getAttribute('href'));
                        pageTags.forEach(item => tagSet.add(item));
                    }
                }
            } catch (error) {
                console.log('error fetching page:', error);
            }
        }

        return tagSet;
    }

    // 解析链接包含的标签
    async function getPageTag(href) {
        const tagSet = new Set();
        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
            "Accept": "*/*",
            "Host": "missav.com",
            "Connection": "keep-alive"
        };

        const requestOptions = {
            method: 'GET',
            headers: headers,
            redirect: 'follow'
        };

        try {
            const response = await fetch(href, requestOptions)
                .then(response => response.text())
                .catch(error => console.log('error', error));
            const parser = new DOMParser();
            const doc = parser.parseFromString(response, 'text/html');
            const tagInfo = doc.querySelector('div.sm\\:mx-0.mb-8.rounded-0.sm\\:rounded-lg');

            let i = 2;
            while (true) {
                select = `div:nth-child(2) > div > div > div > div:nth-child(5) > a:nth-child(${i})`
                const tag = tagInfo.querySelector(select);

                if (tag) {
                    tagSet.add(tag.innerHTML);
                    i++;
                } else {
                    break;
                }
            }
        } catch (error) {
            console.log('error fetching page tag:', error);
        }

        return tagSet;
    }

    // Test
    {
        getTags(1).then(tags => {
            console.log(tags);
        });

        getPageTag("https://missav.com/cn/fft-016-uncensored-leak").then(tags => {
            console.log(tags);
        });

        getPageNumbers();
    }
})();
