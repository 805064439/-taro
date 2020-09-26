import Taro, { useState, useEffect } from '@tarojs/taro'
import { AtNavBar, AtCard, AtTabBar } from 'taro-ui'
import servicePath from '../../config/apiUrl'
import { View } from '@tarojs/components'
import "../orders/orders.scss"
import { axios } from 'taro-axios'

function Orders() {

    const [ordersList, setOrdersList] = useState([])
    const [userName, setuserName] = useState('')


    const clickJump = (id) => {
        Taro.navigateTo({ url: '/pages/orders/orderInfo?id=' + id })
        console.log(id);

    }

    const jumpToGoodList = () => {
        Taro.redirectTo({ url: '../goods/goods' })
    }

    useEffect(() => {

        Taro.getStorage({
            key: 'userName',
            success: function (res) {
                setuserName(res.data)
                axios({
                    method: 'post',
                    url: servicePath.getOrder,
                    data: {
                        'userName': res.data,
                    },
                    withCredentials: false
                }).then(
                    result => {
                        console.log(result.data.data);
                        setOrdersList(result.data.data)
                    })
            }
        })


    }, [])

    return (
        <View>
            <AtNavBar
                onClickLeftIcon={jumpToGoodList}
                onClickRgIconSt={this.handleClick}
                onClickRgIconNd={this.handleClick}
                color='#000'
                rightFirstIconType='shopping-cart'
                rightSecondIconType='user'
                leftIconType='chevron-left'
            >
                <h6>您好 ~ 用户{userName}</h6>
            </AtNavBar>
            <AtCard
                title='我的订单'

            >
                {
                    ordersList.map((item, index) => {
                        return (
                            <AtCard
                                className='order-card'
                                key={index + item}
                                title={item.date + '的订单'}
                                onClick={() => { clickJump(item.Id) }}
                            >
                                <View>{'订单状态：' + item.status}</View>
                                <View>{'物流号码：' + item.code}</View>
                                <View>{'订单价格：' + item.price + '元'}</View>
                            </AtCard>
                        )
                    })
                }
            </AtCard>
            <View className='my-air'></View>
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

export default Orders