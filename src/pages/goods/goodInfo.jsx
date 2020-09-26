import Taro, { useState, useDidShow, useEffect } from '@tarojs/taro'
import { AtCard, AtList, AtMessage, AtButton } from 'taro-ui'
import servicePath from '../../config/apiUrl'
import { View, Image } from '@tarojs/components'
import "../goods/goodScss.scss"
import 'taro-ui/dist/style/components/flex.scss'
import { axios } from 'taro-axios'



function GoodInfo(props) {

    const [goodId, setGoodId] = useState(0)
    const [userName, setuserName] = useState('')
    const [goodInfo, setGoodInfo] = useState([])

    useEffect(() => {
        setTimeout(() => {
            setGoodId(this.$router.params.id)
        }, 50)
        axios({
            method: 'post',
            url: servicePath.getGoodInfo,
            data: {
                'goodId': goodId
            },
            withCredentials: false
        }).then(
            res => {
                setGoodInfo(res.data.data)
                Taro.getStorage({
                    key: 'userName',
                    success: function (res) {
                        setuserName(res.data)
                    }
                })

            })

    }, [goodId])

    const addGood = (goodId, username) => {
        axios({
            method: 'post',
            url: servicePath.checkCartRecord,
            data: {
                'goodId': goodId,
                'userName': username
            },
            withCredentials: false
        }).then(
            res => {
                if(res.data.data == '购物车中有'){
                    axios({
                        method: 'post',
                        url: servicePath.countChange,
                        data: {
                            'userName': username,
                            'change': 'count+1',
                            'id' : goodId
                        },
                        withCredentials: false
                    }).then(
                        res => {
                            Taro.atMessage({
                                'message': '已添加进购物车',
                                'type': 'success',
                              })
                        })
                }else if(res.data.data == '购物车中无'){
                    axios({
                        method: 'post',
                        url: servicePath.addCartRecord,
                        data: {
                            'userName': username,
                            'id' : goodId
                        },
                        withCredentials: false
                    }).then(
                        res => {
                            Taro.atMessage({
                                'message': '已添加进购物车',
                                'type': 'success',
                              })
                        })
                }
            })
    }

    return (
        <View>
            {
                goodInfo.map((item, index) => {
                    return (
                        <View key={index + item}>

                            <AtCard
                                className='good-card'
                                title={item.name}
                            ><Image
                                    className='my-img'
                                    src={item.img}
                                />
                            </AtCard>
                            <View className='my-view'>
                                <View >{item.info}</View>
                                <View >{item.price}元</View>
                            </View>
                            <AtMessage />
                            <AtButton type='primary' onClick={e => addGood(item.id, userName)}>加入购物车</AtButton>
                        </View>
                    )
                })
            }
        </View>
    )

}

export default GoodInfo 