require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

let imageDatas = require('json!../data/imageDatas.json');

// 利用自执行函数，将图片名信息转成图片URL路径信息
imageDatas = (function genImageURL(imageDatasArr) {
	for (var i = imageDatasArr.length - 1; i >= 0; i--) {
		let singleImageData = imageDatasArr[i];

		singleImageData.imageURL = require('../images/' + singleImageData.fileName);

		imageDatasArr[i] = singleImageData;
	}

	return imageDatasArr;
})(imageDatas);

// 构建单幅画的组件
class ImgFigure extends React.Component {
	render() {
		return (
			<figure className='img-figure'>
			  <img src={this.props.data.imageURL} alt={this.props.data.title} />
			  <figcaption>
			    <h2 className="img-title">{this.props.data.title}</h2>
			    <div className="img-back">
			      <p></p>
			    </div>
			  </figcaption>
			</figure>
		);
	}
}

// “大管家”：掌握一切的数据和数据之间的切换
class AppComponent extends React.Component {
  render() {
  	let controllerUnits = [],
  			imgFigures = [];

  	imageDatas.forEach( function(value, index) {
  		// 用图片数据填充imageFigure组件
  		imgFigures.push(<ImgFigure data={value} key={index} ref={'imgFigure' + index}></ImgFigure>);
  	});

    return (
      <section className="stage">
      	<section className="image-sec">
      		{imgFigures}
      	</section>
      	<nav className="controller-nav"></nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
