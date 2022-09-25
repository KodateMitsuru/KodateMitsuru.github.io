hexo.extend.injector.register('body_end', '<script src="/js/timecheck.js"></script>', 'post');
hexo.extend.filter.register('theme_inject', function(injects) {
  injects.head.raw('default', '<script src="https://gcore.jsdelivr.net/gh/kodatemitsuru/live2d-widget@v0.0.3/autoload.js"></script>');
});
