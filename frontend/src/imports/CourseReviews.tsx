import svgPaths from "./svg-553ds7rxeu";

function Container() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[28px] left-0 not-italic text-[#101828] text-[20px] top-[-2.5px] whitespace-nowrap">Teacher Portal</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1a1bc600} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pd2076c0} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p35e1e580} id="Vector_3" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Layout() {
  return (
    <div className="h-[24px] relative shrink-0 w-[82.333px]" data-name="Layout">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-1.5px] whitespace-nowrap">My Courses</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="bg-white h-[52px] relative shrink-0 w-full" data-name="Link">
      <div aria-hidden="true" className="absolute border-2 border-[#99a1af] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[18px] pr-[2px] py-[2px] relative size-full">
          <Icon />
          <Layout />
        </div>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p383b2000} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Layout1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[114.817px]" data-name="Layout">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-white top-[-1.5px] whitespace-nowrap">Student Reviews</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="bg-[#101828] h-[52px] relative shrink-0 w-full" data-name="Link">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[18px] pr-[2px] py-[2px] relative size-full">
          <Icon1 />
          <Layout1 />
        </div>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M10 1.66667V18.3333" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3055a600} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Layout2() {
  return (
    <div className="h-[24px] relative shrink-0 w-[136.483px]" data-name="Layout">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-1.5px] whitespace-nowrap">{`Earnings & Payouts`}</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="bg-white h-[52px] relative shrink-0 w-full" data-name="Link">
      <div aria-hidden="true" className="absolute border-2 border-[#99a1af] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[18px] pr-[2px] py-[2px] relative size-full">
          <Icon2 />
          <Layout2 />
        </div>
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[172px] items-start relative shrink-0 w-full" data-name="Navigation">
      <Link />
      <Link1 />
      <Link2 />
    </div>
  );
}

function Sidebar() {
  return (
    <div className="bg-[#f3f4f6] h-[985px] relative shrink-0 w-[256px]" data-name="Sidebar">
      <div aria-hidden="true" className="absolute border-[#1e2939] border-r-2 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[32px] items-start pl-[24px] pr-[26px] pt-[24px] relative size-full">
        <Container />
        <Navigation />
      </div>
    </div>
  );
}

function TextInput() {
  return (
    <div className="absolute bg-white h-[44px] left-0 top-0 w-[1288px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip pl-[40px] pr-[16px] py-[8px] relative rounded-[inherit] size-full">
        <p className="font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(10,10,10,0.5)] whitespace-nowrap">Search courses...</p>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[12px] size-[20px] top-[12px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pcddfd00} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M17.5 17.5L13.9167 13.9167" id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute h-[44px] left-0 top-0 w-[1288px]" data-name="Container">
      <TextInput />
      <Icon3 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p67f12c8} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p2c19cb00} id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[#d1d5dc] content-stretch flex items-center justify-center left-[1304px] p-[2px] size-[40px] top-[2px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <Icon4 />
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[44px] relative shrink-0 w-full" data-name="Container">
      <Container3 />
      <Button />
    </div>
  );
}

function Header() {
  return (
    <div className="bg-[#f3f4f6] h-[78px] relative shrink-0 w-[1376px]" data-name="Header">
      <div aria-hidden="true" className="absolute border-[#1e2939] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[2px] pt-[16px] px-[16px] relative size-full">
        <Container2 />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-start left-0 top-0 w-[1300px]" data-name="Heading 1">
      <p className="flex-[1_0_0] font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[32px] min-h-px min-w-px not-italic relative text-[#101828] text-[24px]">Student Reviews</p>
    </div>
  );
}

function Label() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[-1.5px] whitespace-nowrap">Select Course to view reviews</p>
    </div>
  );
}

function Option() {
  return <div className="absolute left-[-288px] size-0 top-[-186px]" data-name="Option" />;
}

function Option1() {
  return <div className="absolute left-[-288px] size-0 top-[-186px]" data-name="Option" />;
}

function Option2() {
  return <div className="absolute left-[-288px] size-0 top-[-186px]" data-name="Option" />;
}

function Option3() {
  return <div className="absolute left-[-288px] size-0 top-[-186px]" data-name="Option" />;
}

function Option4() {
  return <div className="absolute left-[-288px] size-0 top-[-186px]" data-name="Option" />;
}

function Dropdown() {
  return (
    <div className="bg-white h-[41px] relative shrink-0 w-full" data-name="Dropdown">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Option />
        <Option1 />
        <Option2 />
        <Option3 />
        <Option4 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[69px] items-start left-0 top-[48px] w-[384px]" data-name="Container">
      <Label />
      <Dropdown />
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[117px] relative shrink-0 w-full" data-name="Container">
      <Heading />
      <Container5 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pa6d0980} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pa6d0980} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pa6d0980} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pa6d0980} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pa6d0980} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[20px] items-center left-[26px] top-[26px] w-[1248px]" data-name="Container">
      <Icon5 />
      <Icon6 />
      <Icon7 />
      <Icon8 />
      <Icon9 />
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute h-[24px] left-[26px] top-[58px] w-[1248px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[0] left-0 not-italic text-[#101828] text-[0px] top-[-1.5px] whitespace-nowrap">
        <span className="font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[24px] text-[16px]">John Doe</span>
        <span className="font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] text-[#4a5565] text-[14px]">- Advanced JavaScript Concepts</span>
      </p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[24px] left-[26px] top-[94px] w-[1248px]" data-name="Paragraph">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#364153] text-[16px] top-[-1.5px] whitespace-nowrap">This course was excellent! I learned so much about JavaScript and the instructor explained everything clearly. Highly recommend to anyone looking to improve their skills.</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute h-[20px] left-[26px] top-[133px] w-[33.667px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Medium',sans-serif] leading-[20px] left-[17px] not-italic text-[#101828] text-[14px] text-center top-[-1.5px] whitespace-nowrap">Reply</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="bg-white h-[180px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <Container8 />
      <Container9 />
      <Paragraph />
      <Button1 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pa6d0980} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pa6d0980} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pa6d0980} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pa6d0980} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pa6d0980} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[20px] items-center left-[26px] top-[26px] w-[1248px]" data-name="Container">
      <Icon10 />
      <Icon11 />
      <Icon12 />
      <Icon13 />
      <Icon14 />
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute h-[24px] left-[26px] top-[58px] w-[1248px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[0] left-0 not-italic text-[#101828] text-[0px] top-[-1.5px] whitespace-nowrap">
        <span className="font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[24px] text-[16px]">Jane Smith</span>
        <span className="font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] text-[#4a5565] text-[14px]">- React for Beginners</span>
      </p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[24px] left-[26px] top-[94px] w-[1248px]" data-name="Paragraph">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#364153] text-[16px] top-[-1.5px] whitespace-nowrap">Great content and well-structured lessons. The examples were practical and easy to follow. Would definitely take more courses from this instructor.</p>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute h-[20px] left-[26px] top-[133px] w-[33.667px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Medium',sans-serif] leading-[20px] left-[17px] not-italic text-[#101828] text-[14px] text-center top-[-1.5px] whitespace-nowrap">Reply</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="bg-white h-[180px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <Container11 />
      <Container12 />
      <Paragraph1 />
      <Button2 />
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pa6d0980} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Icon16() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pa6d0980} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pa6d0980} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Icon18() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pa6d0980} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Icon19() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pa6d0980} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[20px] items-center left-[26px] top-[26px] w-[1248px]" data-name="Container">
      <Icon15 />
      <Icon16 />
      <Icon17 />
      <Icon18 />
      <Icon19 />
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute h-[24px] left-[26px] top-[58px] w-[1248px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[0] left-0 not-italic text-[#101828] text-[0px] top-[-1.5px] whitespace-nowrap">
        <span className="font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[24px] text-[16px]">Michael Brown</span>
        <span className="font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] text-[#4a5565] text-[14px]">- Python Programming Basics</span>
      </p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute h-[24px] left-[26px] top-[94px] w-[1248px]" data-name="Paragraph">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#364153] text-[16px] top-[-1.5px] whitespace-nowrap">Amazing course! The instructor has a great teaching style and the content is very comprehensive. I feel much more confident in my Python skills now.</p>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute h-[20px] left-[26px] top-[133px] w-[33.667px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Medium',sans-serif] leading-[20px] left-[17px] not-italic text-[#101828] text-[14px] text-center top-[-1.5px] whitespace-nowrap">Reply</p>
    </div>
  );
}

function Container13() {
  return (
    <div className="bg-white h-[180px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <Container14 />
      <Container15 />
      <Paragraph2 />
      <Button3 />
    </div>
  );
}

function Icon20() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pa6d0980} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Icon21() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pa6d0980} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Icon22() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pa6d0980} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Icon23() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pa6d0980} fill="var(--fill-0, #101828)" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Icon24() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pa6d0980} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[20px] items-center left-[26px] top-[26px] w-[1248px]" data-name="Container">
      <Icon20 />
      <Icon21 />
      <Icon22 />
      <Icon23 />
      <Icon24 />
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute h-[24px] left-[26px] top-[58px] w-[1248px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[0] left-0 not-italic text-[#101828] text-[0px] top-[-1.5px] whitespace-nowrap">
        <span className="font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[24px] text-[16px]">Sarah Johnson</span>
        <span className="font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] text-[#4a5565] text-[14px]">- UI/UX Design Fundamentals</span>
      </p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="absolute h-[24px] left-[26px] top-[94px] w-[1248px]" data-name="Paragraph">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#364153] text-[16px] top-[-1.5px] whitespace-nowrap">Very informative and practical. The real-world examples helped me understand the concepts better. Looking forward to applying what I learned in my projects.</p>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute h-[20px] left-[26px] top-[133px] w-[33.667px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Medium',sans-serif] leading-[20px] left-[17px] not-italic text-[#101828] text-[14px] text-center top-[-1.5px] whitespace-nowrap">Reply</p>
    </div>
  );
}

function Container16() {
  return (
    <div className="bg-white h-[180px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <Container17 />
      <Container18 />
      <Paragraph3 />
      <Button4 />
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] h-[792px] items-start relative shrink-0 w-full" data-name="Container">
      <Container7 />
      <Container10 />
      <Container13 />
      <Container16 />
    </div>
  );
}

function StudentReviews() {
  return (
    <div className="h-[1005px] relative shrink-0 w-full" data-name="StudentReviews">
      <div className="content-stretch flex flex-col gap-[32px] items-start pt-[32px] px-[32px] relative size-full">
        <Container4 />
        <Container6 />
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div className="bg-[#f9fafb] flex-[1_0_0] min-h-px min-w-px relative w-[1376px]" data-name="Main Content">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pr-[12px] relative rounded-[inherit] size-full">
        <StudentReviews />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="flex-[1_0_0] h-[985px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Header />
        <MainContent />
      </div>
    </div>
  );
}

export default function CourseReviews() {
  return (
    <div className="bg-white content-stretch flex items-start relative size-full" data-name="Course Reviews">
      <Sidebar />
      <Container1 />
    </div>
  );
}