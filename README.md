# fis3-deploy-gfe-combo-url
fis3-deploy-gfe-combo-url


## INSTALL

```bash
npm install [-g] fis3-deploy-gfe-combo-url
```

## USE
```html
	<!-- gfe:combo:begin -->
    <link rel="stylesheet" href="<!--#include file='/n/common/default/style.html' -->">
    <link rel="stylesheet" href="__CSS_DOMAIN__/gmlib/reset/1.0.0/reset.css">
    <link rel="stylesheet" href="/css/common/common.css">
    <!-- gfe:combo:end -->

    <!--[if lte IE9]>
    <link rel="stylesheet" href="/css/index/placeholder.css">
    <![endif]-->

    <!-- gfe:combo:begin -->
    <link rel="stylesheet" href="/css/index/index.css">
    <link rel="stylesheet" href="/css/index/test.css">
    <!-- gfe:combo:end -->

    <!-- gfe:combo:begin -->
    <script src="<!--#include virtual='/n/common/a02/script.html' -->"></script>
    <script src="__CSS_DOMAIN__/gmlib/unit/g/1.0.0/g.min.js"></script>
    <script src="__CSS_DOMAIN__/gmlib/ui/gload/1.0.0/gload.min.js"></script>
    <script src="/js/common/common.js"></script>
    <!-- gfe:combo:end -->

    <!--[if lte IE9]>
    <script src="__CSS_DOMAIN__/gmlib/ui/gslider/1.0.4/gslider.min.js"></script>
    <script src="__CSS_DOMAIN__/gmlib/ui/gslider/1.0.4/gslider.min.js"></script>
    <![endif]-->

    <!-- gfe:combo:begin -->
    <script src="/js/index/index.js"></script>
    <script src="/js/index/test.js"></script>
    <!-- gfe:combo:end -->
```

```js
fis.match('**', {
    deploy: [
        fis.plugin('gfe-combo-url'),//默认参数：comboQuerySplit='??',comboQuerySplit=',',如有需要请自行扩展
        fis.plugin('local-deliver') //must add a deliver, such as http-push, local-deliver
    ]
});
```