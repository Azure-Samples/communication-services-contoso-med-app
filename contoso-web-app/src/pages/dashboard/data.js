const defaultOnClick = () => {
    console.log("dummy implementation");
  };
  
  export const doctorData = [
    {
      name: "Dr. Michael Matthew",
      type: "Gynaecologist",
      imageURL:
        "https://res.cloudinary.com/dtldj8hpa/image/upload/v1598868136/projects/AcsTeleMed/michael_matthew.png"
    },
    {
      name: "Dr. Jonathan Bloc",
      type: "General Physician",
      imageURL:
        "https://res.cloudinary.com/dtldj8hpa/image/upload/v1598868135/projects/AcsTeleMed/jonathan_bloc.png"
    },
    {
      name: "Dr. Brooks Latsha",
      type: "Surgeon",
      imageURL:
        "https://res.cloudinary.com/dtldj8hpa/image/upload/v1598868135/projects/AcsTeleMed/brooks-latsha.png"
    }
    // {
    //   name: "Dr. John Shaw",
    //   type: "Dentist",
    //   imageURL:
    //     "https://res.cloudinary.com/dtldj8hpa/image/upload/v1598868136/projects/AcsTeleMed/john-shaw.png"
    // }
  ];
  
  export const professionCardsData = [
    {
      name: "Dentist",
      imageUrl:
        "https://res.cloudinary.com/dtldj8hpa/image/upload/v1598544758/projects/AcsTeleMed/dentist-icon.png",
      onClick: defaultOnClick,
      count: 124
    },
    {
      name: "Gynaecologist",
      imageUrl:
        "https://res.cloudinary.com/dtldj8hpa/image/upload/v1598544758/projects/AcsTeleMed/gynaecologist-icon.png",
      onClick: defaultOnClick,
      count: 99
    },
    // {
    //   name: "Neurology",
    //   imageUrl:
    //     "https://res.cloudinary.com/dtldj8hpa/image/upload/v1598544758/projects/AcsTeleMed/homeopathy-icon.png",
    //   onClick: defaultOnClick,
    //   count: 73
    // },
    {
      name: "Ayurveda",
      imageUrl:
        "https://res.cloudinary.com/dtldj8hpa/image/upload/v1598865739/projects/AcsTeleMed/ayurved-icon.png",
      onClick: defaultOnClick,
      count: 86
    },
    {
      name: "General Physician",
      imageUrl:
        "https://res.cloudinary.com/dtldj8hpa/image/upload/v1598544758/projects/AcsTeleMed/general-phy-icon.png",
      onClick: defaultOnClick,
      count: 456
    },
    {
      name: "Orthopaedic",
      imageUrl:
        "https://res.cloudinary.com/dtldj8hpa/image/upload/v1598865661/projects/AcsTeleMed/orthopaedic-icon.png",
      onClick: defaultOnClick,
      count: 77
    }
  ];
  
  export const NavItems = [
    {
      url:
        "https://raw.githubusercontent.com/microsoft/fluentui-system-icons/master/assets/Home/SVG/ic_fluent_home_20_regular.svg",
      title: "Home",
      onClick: defaultOnClick
    },
    {
      url:
        "https://raw.githubusercontent.com/microsoft/fluentui-system-icons/master/assets/Heart/SVG/ic_fluent_heart_16_regular.svg",
      title: "My Doctors",
      onClick: defaultOnClick
    },
    {
      url:
        "https://raw.githubusercontent.com/microsoft/fluentui-system-icons/master/assets/Checkbox%20Checked/SVG/ic_fluent_checkbox_checked_20_regular.svg",
      title: "My Bookings",
      onClick: defaultOnClick
    },
    {
      url:
        "https://raw.githubusercontent.com/microsoft/fluentui-system-icons/master/assets/Chat/SVG/ic_fluent_chat_20_regular.svg",
      title: "Chats",
      onClick: defaultOnClick
    },
    {
      url:
        "https://raw.githubusercontent.com/microsoft/fluentui-system-icons/master/assets/Settings/SVG/ic_fluent_settings_20_regular.svg",
      title: "Settings",
      onClick: defaultOnClick
    },
    {
      url:
        "https://raw.githubusercontent.com/microsoft/fluentui-system-icons/master/assets/Sign%20Out/SVG/ic_fluent_sign_out_24_regular.svg",
      title: "Log Out",
      onClick: defaultOnClick
    }
  ];
  