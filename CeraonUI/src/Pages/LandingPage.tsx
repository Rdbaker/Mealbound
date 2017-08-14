import * as React from 'react';
import * as $ from 'jquery';

import CeraonDispatcher from '../Store/CeraonDispatcher';
import * as Actions from '../Actions/Index';
import LandingPageState from '../State/Pages/LandingPageState';
import MealSearchDropdown from '../Components/MealSearchDropdown';
import MealTime from '../State/Meal/Filters/MealTime';

export interface LandingPageProps extends LandingPageState, React.Props<LandingPage> {}

export default class LandingPage extends React.Component<LandingPageProps, {}> {
  constructor() {
    super();
    this.scaleVideoContainer = this.scaleVideoContainer.bind(this);
    this.initBannerVideoSize = this.initBannerVideoSize.bind(this);
    this.scaleBannerVideoSize = this.scaleBannerVideoSize.bind(this);
  }

  onMealSearch(mealTime: MealTime) {
    CeraonDispatcher(Actions.createMealSearchAction({ mealTime: mealTime, textFilter: []}));
  }

  scaleVideoContainer() {
    let height = $(window).height() + 5;
    let unitHeight = parseInt(height) + 'px';
    $('.homepage-hero-module').css('height',unitHeight);
  }

  initBannerVideoSize(elt) {
    $(elt).each(function(){
      $(this).data('height', $(this).height());
      $(this).data('width', $(this).width());
    });
    this.scaleBannerVideoSize(elt);
  }

  scaleBannerVideoSize(elt) {
    let windowWidth = $(window).width();
    let windowHeight = $(window).height() + 5;
    let videoWidth;
    let videoHeight;

    $(elt).each(function(){
      let videoAspectRatio = $(this).data('height')/$(this).data('width');

      if(windowWidth < 1000){
        videoHeight = windowHeight;
        videoWidth = videoHeight / videoAspectRatio;
        $(this).css({'margin-top' : 0, 'margin-left' : -(videoWidth - windowWidth) / 2 + 'px'});
        $(this).width(videoWidth).height(videoHeight);
      }
      $('.homepage-hero-module .video-container video').addClass('fadeIn animated');
    });
  }

  componentDidMount() {
    this.scaleVideoContainer();

    this.initBannerVideoSize('.video-container .poster img');
    this.initBannerVideoSize('.video-container .filter');
    this.initBannerVideoSize('.video-container video');

    $(window).on('resize', (function() {
        this.scaleVideoContainer();
        this.scaleBannerVideoSize('.video-container .poster img');
        this.scaleBannerVideoSize('.video-container .filter');
        this.scaleBannerVideoSize('.video-container video');
    }).bind(this));
  }

  render() {
    return (
      <div>
        <div className="homepage-hero-module">
            <div className="video-container">
                <div className="filter">
                  <div className="headline">{this.props.tagline}</div>
                  <div className="ui divider"></div>
                  <a href="/register" className="ui inverted violet button">{this.props.registerCTA}</a>
                  <a href="/login" className="ui inverted olive button">{this.props.loginCTA}</a>
                  <div className="ui divider horizontal">Or</div>
                  <div className="ui header">
                    <MealSearchDropdown
                      dropdownHeader={this.props.searchDropdownText}
                      onSearchClicked={this.onMealSearch} />
                  </div>
                </div>
                <video autoPlay loop className="fillWidth">
                  <source src="/static/img/Shakshuka/MP4/Shakshuka.mp4" type="video/mp4" />{this.props.videoFailText}
                  <source src="/static/img/Shakshuka/WEBM/Shakshuka.webm" type="video/webm" />{this.props.videoFailText}
                </video>
                <div className="poster hidden">
                  <img src="/static/img/Shakshuka/Snapshots/Shakshuka.jpg" alt="Shakshuka" />
                </div>
            </div>
        </div>
        <div className="ui container how-it-works">
          <h1 className="ui centered header">{this.props.howItWorksText.header}</h1>
          <div className="ui divider horizontal">for</div>
          <div className="ui two column stackable grid">
            <div className="column">
              <img className="ui big rounded image header-image" src="/static/img/buyer-cropped.jpg" />
              <h2 className="ui centered header">{this.props.howItWorksText.buyersHeader}</h2>
              <div className="ui list">
                <div className="item">
                  <i className="search icon"></i>
                  <div className="content">
                    <div className="header">{this.props.howItWorksText.searchHeader}</div>
                    <div className="description">{this.props.howItWorksText.searchDescription}</div>
                  </div>
                </div>
                <div className="item">
                  <i className="credit card icon"></i>
                  <div className="content">
                    <div className="header">{this.props.howItWorksText.payHeader}</div>
                    <div className="description">{this.props.howItWorksText.payDescription}</div>
                  </div>
                </div>
                <div className="item">
                  <i className="food icon"></i>
                  <div className="content">
                    <div className="header">{this.props.howItWorksText.pickupHeader}</div>
                    <div className="description">{this.props.howItWorksText.pickupDescription}</div>
                  </div>
                </div>
                <div className="item">
                  <i className="star empty icon"></i>
                  <div className="content">
                    <div className="header">{this.props.howItWorksText.rateHeader}</div>
                    <div className="description">{this.props.howItWorksText.rateDescription}</div>
                  </div>
                </div>
              </div>
              <a href="/register" className="ui teal fluid button">{this.props.howItWorksText.buyersCTA}</a>
            </div>
            <div className="column">
              <img className="ui big rounded image header-image" src="/static/img/seller-cropped.jpg" />
              <h2 className="ui centered header">{this.props.howItWorksText.sellersHeader}</h2>
              <div className="ui list">
                <div className="item">
                  <i className="marker icon"></i>
                  <div className="content">
                    <div className="header">{this.props.howItWorksText.locateHeader}</div>
                    <div className="description">{this.props.howItWorksText.locateDescription}</div>
                  </div>
                </div>
                <div className="item">
                  <i className="checked calendar icon"></i>
                  <div className="content">
                    <div className="header">{this.props.howItWorksText.setHeader}</div>
                    <div className="description">{this.props.howItWorksText.setDescription}</div>
                  </div>
                </div>
                <div className="item">
                  <i className="horizontally flipped shipping icon"></i>
                  <div className="content">
                    <div className="header">{this.props.howItWorksText.bringHeader}</div>
                    <div className="description">{this.props.howItWorksText.bringDescription}</div>
                  </div>
                </div>
                <div className="item">
                  <i className="dollar icon"></i>
                  <div className="content">
                    <div className="header">{this.props.howItWorksText.earnHeader}</div>
                    <div className="description">{this.props.howItWorksText.earnDescription}</div>
                  </div>
                </div>
              </div>
              <a href="/register" className="ui violet fluid button">{this.props.howItWorksText.sellersCTA}</a>
            </div>
          </div>
        </div>
      </div>
    )
  }

}
