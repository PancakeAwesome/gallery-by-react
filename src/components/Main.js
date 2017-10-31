require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

let imageDatas = require('json!../data/imageDatas.json');

/**
 * 获取区间内的一个随机数
 * @param {int} low
 * @param {int} high
 * @return random number between low and high
 */
function getRangeRandom(low, high) {
    return Math.ceil(Math.random() * (high - low) + low);
}

/**
 * 获取0-30度之间的随机数
 * @return 0-30度之间的随机数
 */
function get30DegRandom() {
    return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30);
}

// 自调用函数：利用自执行函数，将图片名信息转成图片URL路径信息
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
    /**
     * imgFigure的点击事件
     */
    handleClick(e) {
    	console.log(2)
        this.props.inverse();

        e.stopPropagation();
        e.preventDefault();
    }

    render() {
        let styleObj = {},
            imgFigureClassName = 'img-figure';

        // 如果props属性中指定了这张图片的位置，则使用
        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }

        // 如果图片的旋转角度有值且不为0则添加旋转角度
        if (this.props.arrange.rotate) {
            // 兼容低版本浏览器
            ['MozTransform', 'msTransform', 'WebkitTransform', 'transform'].forEach(function(value) {
                styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
            }.bind(this));
        }

        // 控制反转样式
        imgFigureClassName += this.props.arrange.isInverse ? 'is-inverse' : '';

        return (
            <figure className='img-figure' style={styleObj}>
				  <img src={this.props.data.imageURL} alt={this.props.data.title} />
				  <figcaption>
					    <h2 className="img-title">{this.props.data.title}</h2>
					    <div className="img-back" onClick={this.handleClick}>
					      <p>{this.props.data.desc}</p>
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
            //中间展示 figure
            centerPos: {
                left: 0,
                top: 0
            },
            //水平方向取值范围
            horizontalRange: {
                leftSectionX: [0, 0], //左分区figure 的 x(水平)方向取值范围
                rightSectionX: [0, 0], //右分区figure 的 x(水平)方向取值范围
                y: [0, 0] // y 方向取值范围
            },
            //垂直方向取值范围
            verticalRange: {
                x: [0, 0],
                topSectionY: [0, 0]
            }
        };

        this.state = {
            imgsArrangeArr: [
                /*{
                	pos: {
                		left: '0',
                		top: '0',
                	},
                	rotate: 0,    //旋转角度
                	isInverse: false //图片正反面
                }*/
            ]
        };
    }

    // 当组件加载进来之后，为每张图片计算其位置的范围
    componentDidMount() {
        // 获取 stage 的宽高
        let stage = ReactDOM.findDOMNode(this.refs.stage),
            stageWidth = stage.scrollWidth,
            stageHeight = stage.scrollHeight,
            halfStageWidth = Math.ceil(stageWidth / 2),
            halfStageHeight = Math.ceil(stageHeight / 2)
        // 获取 figure 的宽高
        let figure = ReactDOM.findDOMNode(this.refs.imgFigure0),
            figureWidth = figure.scrollWidth,
            figureHeight = figure.scrollHeight,
            halfFigureWidth = Math.ceil(figureWidth / 2),
            halfFigureHeight = Math.ceil(figureHeight / 2)
        this.Constant = {
            // 中心 figure 位置
            centerPos: {
                left: halfStageWidth - halfFigureWidth,
                top: halfStageHeight - halfFigureHeight
            },
            horizontalRange: {
                leftSectionX: [-halfFigureWidth, halfStageWidth - 3 * halfFigureWidth],
                rightSectionX: [3 * halfFigureWidth + halfStageWidth, stageWidth - halfFigureWidth],
                y: [-halfFigureHeight, stageHeight - halfFigureHeight]
            },
            verticalRange: {
                x: [halfStageWidth - figureWidth, halfStageWidth],
                topSectionY: [-halfFigureHeight, halfStageHeight - 3 * halfFigureHeight]
            }
        }

        this.rearrange(0);
    }

    rearrange(centerIndex) {
        let constantPos = this.Constant,
            centerPos = constantPos.centerPos,
            horizontalRange = constantPos.horizontalRange,
            verticalRange = constantPos.verticalRange,
            leftSectionX = horizontalRange.leftSectionX,
            rightSectionX = horizontalRange.rightSectionX
        let figureArrangeArr = this.state.imgsArrangeArr,
            centerFigure = figureArrangeArr.splice(centerIndex, 1)

        // 居中图片
        centerFigure = {
            pos: centerPos,
            rotate: 0
        }
        // 上部区域图片
        let topArrNum = Math.floor(Math.random() * 2), // 上部图片数量 0~1
            topIndex = Math.floor(Math.random() * (figureArrangeArr.length - topArrNum)), // 上部图片起始 index
            figureTopArr = figureArrangeArr.splice(topIndex, topArrNum)

        figureTopArr.forEach((img, index) => {
            figureTopArr[index] = {
                pos: {
                    left: getRangeRandom(verticalRange.x[0], verticalRange.x[1]),
                    top: getRangeRandom(verticalRange.topSectionY[0], verticalRange.topSectionY[1])
                },
                rotate: get30DegRandom(),
            }
        })
        // 左右两边图片
        for (let i = 0, j = figureArrangeArr.length, k = j / 2; i < j; i++) {
            let LORSectionX = null
            if (i < k) {
                LORSectionX = leftSectionX
            } else {
                LORSectionX = rightSectionX
            }
            figureArrangeArr[i] = {
                pos: {
                    left: getRangeRandom(LORSectionX[0], LORSectionX[1]),
                    top: getRangeRandom(horizontalRange.y[0], horizontalRange.y[1])
                },
                rotate: get30DegRandom(),
            }
        }
        if (figureTopArr && figureTopArr[0]) {
            figureArrangeArr.splice(topIndex, 0, figureTopArr[0])
        }
        figureArrangeArr.splice(centerIndex, 0, centerFigure);

        this.setState({
            imgsArrangeArr: figureArrangeArr
        })
    }

    /**
     * 翻转图片
     * @param {int} index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
     * @return {Function} 这是一个闭包函数，其内return一个真正待被执行的函数
     */
    inverse(index) {
        return function() {
            var imgsArrangeArr = this.state.imgsArrangeArr;
            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

            this.setState({
                imgsArrangeArr: imgsArrangeArr
            });
        }.bind(this);
    }

    render() {
        let controllerUnits = [],
            imgFigures = [];

        imageDatas.forEach(function(value, index) {
            // 判断当前图片的位置信息是否已经初始化，如果没有初始化，则初始化图片的信息
            if (!this.state.imgsArrangeArr[index]) {
                this.state.imgsArrangeArr[index] = {
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate: 0,
                    isInverse: false
                }
            }

            // 用图片数据填充imageFigure组件
            imgFigures.push(
                <ImgFigure data={value}
                key={index}
                ref={'imgFigure' + index}
                arrange={this.state.imgsArrangeArr[index]}
                inverse={this.inverse(index)}>
    			</ImgFigure>
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
