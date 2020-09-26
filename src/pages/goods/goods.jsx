import Taro, { useState, useDidShow } from '@tarojs/taro'
import { AtNavBar, AtList, AtListItem, AtTabBar } from 'taro-ui'
import servicePath from '../../config/apiUrl'
import { View } from '@tarojs/components'

function Goods() {

    const [goodsList, setGoodsList] = useState([])
    const [userName, setuserName] = useState('')

    const clickJump = (id) => {
        Taro.navigateTo({ url: '/pages/goods/goodInfo?id=' + id })
    }

    const jumpToCart = () => {
        Taro.redirectTo({ url: '/pages/cart/cart' })
    }

    const jumpToOrder = () => {
        Taro.redirectTo({ url: '/pages/orders/orders' })
    }

    useDidShow(async () => {
        Taro.request({
            url: servicePath.getGoods
        }).then(res => {
            console.log(res.data.data)
            setGoodsList(res.data.data)
        })
        Taro.getStorage({
            key: 'userName',
            success: function (res) {
                console.log('userName=' + res.data)
                setuserName(res.data)
            }
        })
    })

    return (
        <View>
            <AtNavBar
                onClickRgIconSt={jumpToCart}
                onClickRgIconNd={jumpToOrder}
                color='#000'
                rightFirstIconType='shopping-cart'
                rightSecondIconType='user'
            >
                <h6>您好 ~ 用户{userName}</h6>
            </AtNavBar>
            <AtList>
                {
                    goodsList.map((item, index) => {
                        return (
                            <AtListItem
                                key={index + item}
                                title={item.name}
                                note={item.info}
                                thumb={item.img}
                                onClick={() => { clickJump(item.id) }}
                            />)
                    })
                }
            </AtList>
            <AtTabBar
                fixed
                tabList={[
                    { title: '商品目录', iconType: 'shopping-bag' },
                    { title: '购物车', iconType: 'shopping-cart' },
                    { title: '我的订单', iconType: 'bullet-list' }
                ]}
                current={0}
                onClick={e => {
                    if (e == 1) {
                        Taro.redirectTo({ url: '/pages/cart/cart' })
                    }
                    else if(e==2){
                        Taro.redirectTo({ url: '/pages/orders/orders' })
                    }
                }}
            />
        </View>
    )
}

export default Goods 