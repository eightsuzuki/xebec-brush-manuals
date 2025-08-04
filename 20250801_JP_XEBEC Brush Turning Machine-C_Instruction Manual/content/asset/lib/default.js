//
//
// ===== 共通スクリプト =====
//
//


//
// === 初期実行 ===
//

$(function() {
'use strict';


  //
  // === 共通 ===
  //

  var
    $window = $(window),
    $body = $('body'),
    $header = $('#page-header');



  //
  // --- メニューをセット ---
  //

  var setMenuList = function($menu) {

    var
      $menuList = $menu.children('ul'),
      classGroup = 'group',
      classGroupExpanded = 'expanded',
      classActive = 'active',
      slideSpeed = 'fast',
      // location.filepathの場合、file:スキーム時にフルパスとなるためhrefを利用しています
      filename = window.location.href.match(".+/(.+?)([\?#;].*)?$")[1];

    // --- グループの開閉 ---
    $menuList
      .children('li')
      .has('ul')
      .addClass(classGroup);

    // --- 現在地をセットし、第2階層の場合は開く ---
    $menuList
      .find('a[href=\"' + filename +  '\"]')
      .parent('li')
      .addClass(classActive)
      .parents('.' + classGroup)
      .addClass(classGroupExpanded)
      .children('ul')
      .show();

    // --- グループの親が現在地の場合も開く ---
    $menuList
      .find('.group.active')
      .addClass(classGroupExpanded)
      .children()
      .show();

    // --- アイコンをクリック ---
    $menuList
      .find('.' + classGroup + ' > .icon')
      .click(function(e) {
        var
          $this = $(this),
          $parent = $this.parents('li'),
          $childList = $parent.children('ul');

        if ($parent.hasClass(classGroupExpanded)) {
          $childList.slideUp(slideSpeed);
          $parent.removeClass(classGroupExpanded);
        } else {
          $childList.slideDown(slideSpeed);
          $parent.addClass(classGroupExpanded);
        }
        return false;
      });

    };



  //
  // --- スクロールバーをセット ---
  //

  var setCustomScrollbar = function($customScroll) {

    if ($.fn.mCustomScrollbar) {

      var
        themeName = $customScroll.attr('data-scroll-theme');

      themeName = themeName ? themeName : 'light';

      $customScroll
        .mCustomScrollbar({
          axis: 'y',
          theme: themeName,
          autoHideScrollbar: false
        });

    }

  };



  //
  // --- スムーススクロール ---
  //

  if ($.fn.smoothScroll) {

    var
      scrollOffset = $('#page-header').height() + 20;  // 20はヘッダー下部との隙間サイズです

    // --- ページ内 ---

    $('#page-content a[href^="#"]')
      .smoothScroll({
        offset: -scrollOffset
      });

    // --- ページの先頭へ ---

    $('.to-page-top a')
      .smoothScroll({
        scrollTarget: 'body'
      });

    // --- ページが開いた時 ---

    if (location.hash) {
      $.smoothScroll({
        scrollTarget: location.hash,
        offset: -scrollOffset
      });
    }

  }



  //
  //
  // === ウィンドウイベント ===
  //
  //

  var
    classScrollDown = 'status-scroll-down',
    classScrollUp = 'status-scroll-up';


  //
  // --- スクロール位置でクラスを変更（トップから一定量スクロールダウン） ---
  //

  if ($body.hasClass('doc-enable-scroll-down')) {

    var
      scrollTopThreshold = $header.height();

    $window
      .scroll(function() {

        var currentPos = $(this).scrollTop();

        if (currentPos > scrollTopThreshold) {
          $body.addClass(classScrollDown);
        } else {
          $body.removeClass(classScrollDown);
        }

      });

  }


  //
  // --- スクロール位置でクラスを変更（スクロールアップ／ダウン） ---
  //

  if ($body.hasClass('doc-enable-scroll-updown')) {

    var
      scrollStartPos = 0,
      scrollThreshold = 50,
      isScrollDown = false;

    $window
      .scroll(function() {

        var currentPos = $(this).scrollTop();

        if (Math.abs(scrollStartPos - currentPos) > scrollThreshold) {

          if (currentPos > scrollStartPos) {

            // 下にスクロール中
            if (!isScrollDown) {
              $body
                .removeClass(classScrollUp)
                .addClass(classScrollDown);
            }
            isScrollDown = true;

          } else {

            // 上にスクロール中
            if (isScrollDown) {
              $body
                .removeClass(classScrollDown)
                .addClass(classScrollUp);
            }
            isScrollDown = false;

          }

          scrollStartPos = currentPos;
 
        }

      });

  }



  //
  // === ピンチイン／アウト対応 ===
  //

  var
    classPinchOut = 'status-pinch-out';

	$body
		.on('gesturechange', function(event) {
			var
				orgEvent = event.originalEvent,
				scale = Math.round(orgEvent.scale * 100) / 100;

      if (scale > 1) {
        $body.addClass(classPinchOut);
      } else {
        $body.removeClass(classPinchOut);
      }

		});



  //
  //
  // === ファイルの読み込み ===
  //
  //

  //
  // --- メニューを読み込み ---
  //
  $(window).load(function (){
      // 特定のテーマでメニューの開閉機能をセット
      if ($body.hasClass('doc-enable-menu-slide')) {

        // XSサイズであればメニューを閉じる
        if ($window.width() <= 768) {
          $body.addClass('status-menu-closed');
        }

        setMenuList($('.wiki-toc'));

      }

      // [Stone] の場合メニューを半分にする
      if ($body.hasClass('doc-theme-stone')) {
        var
          $list = $('.wiki-toc').children('ul').children('li'),
          listCount = $list.length;
         $list
          .eq(Math.ceil(listCount / 2))
          .prevAll()
          .addClass('first-column');
      }

      // カスタムスクロールをセット
      setCustomScrollbar($('.custom-scroll-bar'));

      //画像の高さ指定を幅指定に変換する
      $('div.wiki-content img[height]').each(function(){
          var img_height = $(this).height();
          var img_width  = $(this).width();
 
          var height_attr = $(this).attr('height');
          var img = new Image();
          img.src = $(this).attr('src');
          var _width = img.width;
          $(this).css('width', (height_attr * img_width) / img_height);
          $(this).removeAttr('height');
      });
  });



  //
  //
  // === アニメーションの準備完了 ===
  //
  //

  // --- アニメーションの準備がｋできたらクラスを追加 ---
  setTimeout(function() {
    $body.addClass('animation-ready');
  }, 100);

});

// --- eof ---
