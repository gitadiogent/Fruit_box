export const AuthReducer = (state,action)=>{
    switch (action.type) {
        case "LOG_IN":
            return {
                ...state,
                isAuthenticated:true,
                user:action.payload,
                error:false
            }
        case "LOG_OUT":
            return {
                ...state,
                isAuthenticated:false,
                user:null,
                error:false
            }
        case "ERROR":
            return {
                ...state,
                error:action.error,
                isAuthenticated:false,
                user:null,
            }
        case "CART_STATE":
            return {
                 ...state,
                 cartCount:action.payload
            }
        case "CART_TOTAL":
            return {
                ...state,
                cartTotal:action.payload
            }
        case "ADMIN_DETAILS":
            return {
                ...state,
                adminDetails:action.payload
            }
        case "HOME_SCREEN_BANNER":
            return {
                 ...state,
                 homeBanner:action.payload
            }
        case "HOME_SCREEN_TRENDING_PRODUCTS":
            return {
                ...state,
                trendingProducts:action.payload
            }
        case "HOME_SCREEN_NEW_ARRIVAL_PRODUCTS":
            return {
                ...state,
                newArrivalsProducts:action.payload
            }
            
    
        default:
         return state;
    }
}

