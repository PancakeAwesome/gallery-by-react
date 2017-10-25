require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

// let imageDatas = require('../data/imageDatas.json');

// // 利用自执行函数，将图片名信息转成图片URL路径信息
// imageDatas = (function genImageURL(imageDatasArr) {
// 	for (var i = imageDatasArr.length - 1; i >= 0; i--) {
// 		let singleImageData = imageDatasArr[i];

// 		singleImageData.imageURL = require('../images/' + singleImageData.filename);

// 		imageDatasArr[i] = singleImageData;
// 	}
// })(imageDatas);

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
      	<section className="image-sec"></section>
      	<nav className="controller-nav"></nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
