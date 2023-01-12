export const SliderSetting={
    infinite: false,
    speed: 500,
    slidesToShow: 2.9,
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 1500,
            settings: {
                slidesToShow: 4,
            }
        },
        {
            breakpoint: 1400,
            settings: {
                slidesToShow: 4,
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 2.1,
            }
        },
        {
            breakpoint: 0,
            settings: {
                slidesToShow: 1,
            }
        }
    ]
}