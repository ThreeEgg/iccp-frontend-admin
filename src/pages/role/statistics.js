import React, { Component } from 'react'
import * as imService from '@/services/system'

export class statistics extends Component {

  state = {
    totalInfo:''
  }

  componentDidMount(){
    this.getStaticsInfo()
  }

  getStaticsInfo = async ()=>{
    const{data}=await imService.getStaticsInfo()

    this.setState({
      totalInfo : data
    })

  }

  render() {
    const {totalInfo} = this.state
    return (
      <div>
        数据统计
        <hr/>
        <p>平台用户数：<span>{
          totalInfo&&totalInfo.filter(item=>{
            return item.type === "user"
          })[0].count
        }</span></p>
        <p>平台专家数：<span>{
          totalInfo&&totalInfo.filter(item=>{
            return item.type === "expert"
          })[0].count
        }</span></p>
      </div>
    )
  }

}

export default statistics
