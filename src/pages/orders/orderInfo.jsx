import Taro, { useState, useEffect } from '@tarojs/taro'
import { AtNavBar, AtCard, AtIcon, AtTabBar } from 'taro-ui'
import servicePath from '../../config/apiUrl'
import { View, Text, Image } from '@tarojs/components'
import "../orders/orderInfo.scss"
import { axios } from 'taro-axios'


function OrderInfo() {

    const [orderId, setOrderId] = useState(0)
    const [cartList, setCartList] = useState([])
    const [userName, setuserName] = useState('')
    const [orderInfo, setOrderInfo] = useState([])
    var Sum = 0


    const getOrderGood = (orderId) => {

        axios({
            method: 'post',
            url: servicePath.getOrderGood,
            data: {
                'orderId': orderId
            },
            withCredentials: false
        }).then(
            res => {
                setCartList(res.data.data)
            })
    }

    const getOrderInfo = (orderId) => {
        axios({
            method: 'post',
            url: servicePath.getOrderInfo,
            data: {
                'orderId': orderId
            },
            withCredentials: false
        }).then(
            result => {
                setOrderInfo(result.data.data)
            })
    }

    useEffect(() => {
        setTimeout(() => {
            setOrderId(this.$router.params.id)
        }, 50)
        getOrderGood(orderId)
        getOrderInfo(orderId)

        Taro.getStorage({
            key: 'userName',
            success: function (res) {
                setuserName(res.data)
            }
        })
    }, [orderId])

    return (
        <View>
            <AtNavBar
                onClickRgIconSt={this.handleClick}
                onClickRgIconNd={this.handleClick}
                color='#000'
                rightFirstIconType='shopping-cart'
                rightSecondIconType='user'
            >
                <h6>您好 ~ 用户{userName}</h6>
            </AtNavBar>
            <AtCard
                title='订单详情'
            >
                {
                    orderInfo.map((item, index) => {
                        return (
                            <View key={index + item}>
                                <View className='at-row'>
                                    <View className='at-col at-col-1 at-col--auto my-icon'><AtIcon value='shopping-bag-2' size='30' color='#F00'></AtIcon></View>
                                    <View className='at-col my-icon'>
                                        <View className='at-row'>
                                            <View className='at-col'>团长：{item.dancyou}</View>
                                            <View className='at-col at-col__offset-1'>订单状态：{item.status}</View>
                                        </View>
                                        <View>物流号：{item.code}</View>
                                    </View>
                                </View>

                                <View className='at-row'>
                                    <View className='at-col at-col-1 at-col--auto my-icon'><AtIcon value='map-pin' size='30' color='#1E90FF'></AtIcon></View>
                                    <View className='at-col my-icon'>
                                        <View className='at-row'>
                                            <View className='at-col'>收件人：{item.addressee}</View>
                                            <View className='at-col at-col__offset-1'>联系电话：{item.telephone}</View>
                                        </View>
                                        <Text className='at-col at-col--wrap'>地址：{item.address}</Text>
                                    </View>
                                </View>
                            </View>
                        )
                    })
                }
                <View>
                    {
                        cartList.map((item, index) => {
                            return (
                                <View key={index + item} className=' my-div'>
                                    <View className='at-row my-pad'>
                                        <View className='at-col my-imgdiv at-col-1 at-col--auto'>
                                            <Image
                                                className=' my-img'
                                                src={item.goodImg}
                                            />
                                        </View>
                                        <View className='at-col my-info'>
                                            <View>{item.goodName}</View>
                                            <View className='my-priceAndCount at-row'>
                                                <View className='my-price at-col'>{item.goodPrice}元</View>
                                                <View className='my-count at-col'>
                                                    {'x' + item.count}
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>
                <View className='my-sum'>
                    <View className='at-row at-row__justify--between'>
                        {
                            cartList.map((item, index) => {
                                Sum = Sum + item.goodPrice * item.count
                                Sum = Math.floor(Sum * 100) / 100
                            })
                        }
                        <View className='at-col at-col-1'>商品总价</View>
                        <View className='at-col at-col-1'>{Sum}元</View>
                    </View>
                </View>
            </AtCard>
            <AtTabBar
                fixed
                tabList={[
                    { title: '商品目录', iconType: 'shopping-bag' },
                    { title: '购物车', iconType: 'shopping-cart' },
                    { title: '我的订单', iconType: 'bullet-list' }
                ]}
                current={2}
                onClick={e => {
                    if (e == 1) {
                        Taro.redirectTo({ url: '/pages/cart/cart' })
                    }
                    else if (e == 0) {
                        Taro.redirectTo({ url: '/pages/goods/goods' })
                    }
                }}
            />
        </View>
    )
}
export default OrderInfo