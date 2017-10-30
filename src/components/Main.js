require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

let imageDatas = require('json!../data/imageDatas.json');

/**
 * 获取区间内的一个随机数
 */
function getRangeRandom(low, high) {
    return Math.ceil(Math.random() * (high - low) + low);
}

// 利用自执行函数，将图片名信息转成图片URL路径信息
imageDatas = (function genImageURL(imageDatasArr) {
    for (let i = imageDatasArr.length - 1; i >= 0; i--) {
        let singleImageData = imageDatasArr[i];

        singleImageData.imageURL = require('../images/' + singleImageData.fileName);

        imageDatasArr[i] = singleImageData;
    }

    return imageDatasArr;
})(imageDatas);

// 构建单幅画的组件
class ImgFigure extends React.Component {
    render() {
    	let styleObj = {};

    	// 如果props属性中指定了这张图片的位置，则使用
    	if (this.props.arrange.pos) {
    		styleObj = this.props.arrange.pos;
    	}

        return (
            <figure className='img-figure' style={styleObj}>
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

// 掌握一切的数据和数据之间的切换
class GalleryByReactApp extends React.Component {
    // es6:构造函数
    constructor(props) {
        super(props);

        // 存储排布的可取范围
        this.Constant = {
            // 中心图片的位置点
            centerPos: {
                left: 0,
                right: 0
            },
            // 水平方向的取值范围
            hPosRange: {
                leftSecX: [0, 0],
                rightSecX: [0, 0],
                y: [0, 0]
            },
            // 垂直方向的取值范围
            vPosRange: {
                x: [0, 0],
                topY: [0, 0]
            }
        };

        this.state = {
            imgsArrangeArr: [
                // pos: {
                // 	left: '0',
                // 	right: '0'
                // }
            ]
        };
    }

    // 当组件加载进来之后，为每张图片计算其位置的范围
    componentDidMount() {
        // 首先拿到舞台的大小
        let stageDom = ReactDOM.findDOMNode(this.refs.stage),
            stageW = stageDom.scrollWidth,
            stageH = stageDom.scrollHeight,
            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);

        // 拿到一个imageFigure的大小
        let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = Math.ceil(imgW / 2),
            halfImgH = Math.ceil(imgH / 2);

        // 计算Constant内的各个位置的值,通过LEFT和top定位图片在舞台的位置
        // 计算中心图片的位置点
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH,
        }

        /**
         * 计算左侧和右侧区域的位置点
         */
        this.Constant.hPosRange.leftSecX[0] -= halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.Constant.hPosRange.y[0] -= halfImgH;
        this.Constant.hPosRange.y[1] = halfStageH - halfImgH;

        /**
         * 计算上侧区域的位置点
         */
        this.Constant.vPosRange.topY[0] -= halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
        this.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.Constant.vPosRange.x[0] = halfStageW;

        /**
         * 重新布局所有图片
         * @param centerIndex 指定居中排布图片的下标
         * @default param 居中第一张图片
         */
        this.rearrange(0);

    }

    rearrange(centerIndex) {
        let imgsArrangeArr = this.state.imgsArrangeArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,
            hPosRangeLeftSecx = hPosRange.leftSecX,
            hPosRangeRightSecx = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,
            vPosRangeTopY = vPosRange.topY,
            vPosRangex = vPosRange.x,
            // 存储显示在上侧区域的图片信息
            imgsArrangeTopArr = [],
            // 取一个或者不取
            topImgNum = Math.ceil(Math.random() * 2),
        	topImgSpliceIndex = 0,
        	imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

        // 首先居中centerIndex的图片
        imgsArrangeCenterArr[0].pos = centerPos;

        // 取出要布局上侧的图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, 1);

        // 布局位于上侧的图片
        imgsArrangeTopArr.forEach(function(value, index) {
            imgsArrangeTopArr[index].pos = {
                top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                left: getRangeRandom(vPosRangex[0], vPosRangex[1])
            }
        });

        // 布局两侧图片
        for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
            let hPosRangeLORX = null;

            // 前半部分布局左边，右半部分布局右边
            if (i < k) {
                hPosRangeLORX = hPosRangeLeftSecx;
            } else {
                hPosRangeLORX = hPosRangeRightSecx;
            }

            imgsArrangeArr[i].pos = {
                top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
            }
        }

        // 将之前取出来的上侧图片再放回去
        if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }
        // 将之前取出来的中心图片再放回去
        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        // 设置state，触发组件的重新渲染
        this.setState({
            imgsArrangeArr: imgsArrangeArr
        });
    }


    render() {
        let controllerUnits = [],
            imgFigures = [];

        imageDatas.forEach(function(value, index) {
            // 判断当前图片的位置信息是否已经初始化，如果没有初始化，则初始化图片的位置信息
            if (!this.state.imgsArrangeArr[index]) {
                this.state.imgsArrangeArr[index] = {
                    pos: {
                        left: 0,
                        top: 0
                    }
                }
            }

            // 用图片数据填充imageFigure组件
            imgFigures.push(
                <ImgFigure data={value} key={index} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]}></ImgFigure>
            );
        }.bind(this));

        return (
            <section className="stage" ref='stage'>
		      	<section className="image-sec">
		      		{imgFigures}
		      	</section>
		      	<nav className="controller-nav"></nav>
		    </section>
        );
    }
}

GalleryByReactApp.defaultProps = {
};

export default GalleryByReactApp;
