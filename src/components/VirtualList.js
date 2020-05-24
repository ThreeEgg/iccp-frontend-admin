import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  AutoSizer, InfiniteLoader, List, CellMeasurer, CellMeasurerCache, Grid,
} from 'react-virtualized';
import 'react-virtualized/styles.css';

const styles = {
  list: {
    outline: 'none',
  },
};

const defaultResponseRule = {
  xl: 2,
  lg: 2,
  md: 2,
  sm: 2,
  xs: 2,
};
const getResponseRows = (width, rule) => ({ ...defaultResponseRule, ...rule }[width]);

/**
 * 虚拟列表
 * @see 基于[react-virtualized](https://bvaughn.github.io/react-virtualized/)
 * Todo： 上拉加载、下拉刷新
 */
class VirtualList extends Component {
  measurerCache = new CellMeasurerCache({
    defaultHeight: 30,
    fixedWidth: true,
  });

  loadedRowMap = [];

  getRowCount = () => {
    const {
      data, width, response, responseRule,
    } = this.props;
    let rows = 1;
    if (response) {
      rows = getResponseRows(width, responseRule);
      return Math.ceil(data.length / rows);
    }
    return data.length;
  }

  rowRenderer = ({
    index, key, style, parent,
  }) => {
    const {
      data, itemRender, itemLineStyle, onItemClick,
    } = this.props;
    return (
      <CellMeasurer
        cache={this.measurerCache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        {({ measure }) => (
          <div
            key={key}
            style={{ ...style, ...itemLineStyle }}
            onClick={() => onItemClick(data[index], index)}
          >
            {itemRender(data[index], index, measure)}
          </div>
        )}
      </CellMeasurer>
    );
  }

  responsiveRowRender = ({
    index, key, style, parent,
  }) => {
    const {
      data, itemRender, width, responseRule, itemLineStyle, onRowClick, onItemClick,
    } = this.props;
    const rows = getResponseRows(width, responseRule);

    const rowData = [];
    for (let i = 0; i < rows; i += 1) {
      const dataIndex = rows * index + i;
      const renderData = data[dataIndex];
      // if (!renderData) {
      //   console.log(rowData)
      //   break;
      // }
      rowData.push(
        <Grid key={dataIndex} item xs onClick={() => onItemClick(renderData, dataIndex)}>
          {
            renderData
              ? itemRender(renderData, dataIndex)
              : null
          }
        </Grid>,
      );
    }

    return (
      <CellMeasurer
        cache={this.measurerCache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        <div style={{ ...style, ...itemLineStyle }} key={key} onClick={() => onRowClick(rowData, index)}>
          {rowData}
        </div>
      </CellMeasurer>
    );
  }

  scrollHandler = (scrollInfo) => {
    const { clientHeight, scrollHeight, scrollTop } = scrollInfo;
    const { scrollUpperThreshold, scrollLowerThreshold, scrollHandler } = this.props;
    if (!scrollHandler) {
      return;
    }

    // FIXME: 这里的threshold不为0时，节流还没有考虑好用什么方式
    if (scrollTop <= scrollUpperThreshold) {
      scrollHandler({
        type: 'upper',
        scrollInfo,
      });
      return;
    }

    if ((scrollHeight - scrollTop - clientHeight) <= scrollLowerThreshold) {
      scrollHandler({
        type: 'lower',
        scrollInfo,
      });
    }
  }

  componentDidMount = () => {
    const { onRef } = this.props;

    if (onRef) {
      onRef(this);
    }
  }

  render() {
    const { response, classes, emptyRenderer, listProps = {}, isNextPageLoading, hasNextPage, loadNextPage, dropdownLoad, loadThreshold } = this.props;
    const loadMoreRows = isNextPageLoading ? () => { } : loadNextPage;
    const isRowLoaded = ({ index }) => {
      return !hasNextPage || (dropdownLoad ? index > 0 : index < this.getRowCount())
    };
    return (
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={loadMoreRows}
        rowCount={hasNextPage ? this.getRowCount() + 1 : this.getRowCount()}
        threshold={loadThreshold}>
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer>
            {({ width, height }) => (
              <List
                ref={registerChild => this.list = registerChild}
                // className={classes.list}
                style={{ outline: 'none' }}
                width={width}
                height={height}
                overscanRowCount={100}
                rowCount={this.getRowCount()}
                rowHeight={this.measurerCache.rowHeight}
                deferredMeasurementCache={this.measurerCache}
                rowRenderer={response ? this.responsiveRowRender : this.rowRenderer}
                noRowsRenderer={emptyRenderer}
                onScroll={this.scrollHandler}
                onRowsRendered={onRowsRendered}
                {...listProps}
              />
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
    );
  }
}

VirtualList.propTypes = {
  /** 用于覆盖样式 */
  classes: PropTypes.object,
  /** 列表数据 */
  data: PropTypes.array.isRequired,
  /** 列表项渲染组件 */
  itemRender: PropTypes.func.isRequired,
  /** 列表每行的容器样式 */
  itemLineStyle: PropTypes.object,
  /**
   * 列表项点击事件
   * @param {*} data 列表项数据
   * @param {number} index 列表项序号
   */
  onItemClick: PropTypes.func,
  /**
   * 列表行点击事件，仅响应式下支持
   * @param {*} data 列表项数据
   * @param {number} index 列表项序号
   */
  onRowClick: PropTypes.func,
  /** 空状态渲染组件 */
  emptyRenderer: PropTypes.func,
  /** 响应式开关 */
  response: PropTypes.bool,
  /** 响应式规则，遵循materail breakpoints */
  responseRule: PropTypes.objectOf(PropTypes.number),
  /** 滚动到顶部的阈值 */
  scrollUpperThreshold: PropTypes.number,
  /** 滚动到底部的阈值 */
  scrollLowerThreshold: PropTypes.number,
  /**
   * 滚动事件
   * @param {Object} data {type: "lower" | "upper", scrollInfo: {scrollTop: 0, scrollHeight: 0, clientHeight: 0}}
   */
  scrollHandler: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]),
  /** 有下一页 */
  hasNextPage: PropTypes.bool,
  /** 正在加载 */
  isNextPageLoading: PropTypes.bool,
  /** 加载下一页 */
  loadNextPage: PropTypes.func,
  /** 下拉加载 */
  dropdownLoad: PropTypes.bool,
  /** 触发加载阈值 */
  loadThreshold: PropTypes.number,
};

VirtualList.defaultProps = {
  classes: {},
  response: false,
  responseRule: defaultResponseRule,
  itemLineStyle: {},
  onItemClick: () => { },
  onRowClick: () => { },
  emptyRenderer: () => <div />,
  scrollUpperThreshold: 0,
  scrollLowerThreshold: 0,
  scrollHandler: false,
  hasNextPage: false,
  isNextPageLoading: false,
  dropdownLoad: true,
  loadThreshold: 5,
  loadNextPage: () => { },
};

export default VirtualList;
