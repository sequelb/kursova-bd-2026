import svgPaths from "./svg-be5lnjsgh4";

function Container() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[28px] left-0 not-italic text-[#101828] text-[20px] top-[-2.5px] whitespace-nowrap">Student Portal</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pd2ce200} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M18.3333 8.33333V13.3333" id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1ead9c00} id="Vector_3" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Layout() {
  return (
    <div className="h-[24px] relative shrink-0 w-[87.5px]" data-name="Layout">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-1.5px] whitespace-nowrap">My Learning</p>
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
          <path d="M10 5.83333V17.5" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p25713000} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Layout1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[54.267px]" data-name="Layout">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-1.5px] whitespace-nowrap">Catalog</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="bg-white h-[52px] relative shrink-0 w-full" data-name="Link">
      <div aria-hidden="true" className="absolute border-2 border-[#99a1af] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[18px] pr-[2px] py-[2px] relative size-full">
          <Icon1 />
          <Layout1 />
        </div>
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[112px] items-start relative shrink-0 w-full" data-name="Navigation">
      <Link />
      <Link1 />
    </div>
  );
}

function Sidebar() {
  return (
    <div className="bg-[#f3f4f6] h-[1494px] relative shrink-0 w-[256px]" data-name="Sidebar">
      <div aria-hidden="true" className="absolute border-[#1e2939] border-r-2 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[32px] items-start pl-[24px] pr-[26px] pt-[24px] relative size-full">
        <Container />
        <Navigation />
      </div>
    </div>
  );
}

function Icon2() {
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

function Container3() {
  return (
    <div className="absolute bg-[#d1d5dc] content-stretch flex items-center justify-center left-[1304px] p-[2px] size-[40px] top-[2px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <Icon2 />
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

function Container4() {
  return (
    <div className="absolute h-[44px] left-0 top-0 w-[1288px]" data-name="Container">
      <TextInput />
      <Icon3 />
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[44px] relative shrink-0 w-full" data-name="Container">
      <Container3 />
      <Container4 />
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
    <div className="absolute h-[36px] left-0 top-0 w-[887.6px]" data-name="Heading 1">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[36px] left-0 not-italic text-[#101828] text-[30px] top-[-3px] whitespace-nowrap">Advanced JavaScript Concepts</p>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[20px] relative shrink-0 w-[68.833px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-1.5px] whitespace-nowrap">Categories:</p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="bg-[#f3f4f6] h-[32px] relative shrink-0 w-[112.817px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-2 border-[#99a1af] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-[14px] not-italic text-[#101828] text-[14px] top-[4.5px] whitespace-nowrap">Programming</p>
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="bg-[#f3f4f6] h-[32px] relative shrink-0 w-[89.067px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-2 border-[#99a1af] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-[14px] not-italic text-[#101828] text-[14px] top-[4.5px] whitespace-nowrap">JavaScript</p>
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="bg-[#f3f4f6] h-[32px] relative shrink-0 w-[142.933px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-2 border-[#99a1af] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-[14px] not-italic text-[#101828] text-[14px] top-[4.5px] whitespace-nowrap">Web Development</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[32px] items-center left-0 top-[52px] w-[887.6px]" data-name="Container">
      <Text />
      <Text1 />
      <Text2 />
      <Text3 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="absolute left-[377.8px] size-[64px] top-0" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
        <g id="Icon" />
      </svg>
    </div>
  );
}

function Container8() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[100px] left-1/2 top-1/2 w-[819.6px]" data-name="Container">
      <Icon4 />
      <div className="absolute inset-[-9%_44.97%_27%_45.02%] overflow-clip" data-name="Image">
        <div className="absolute inset-[12.5%]" data-name="Icon">
          <div className="absolute inset-[-3.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 65.5 65.5">
              <path d={svgPaths.p31d5070} id="Icon" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
            </svg>
          </div>
        </div>
      </div>
      <p className="-translate-x-1/2 absolute font-['Noto_Sans_Symbols:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[28px] left-[409.9px] text-[#6a7282] text-[18px] text-center top-[71px] whitespace-nowrap">[Image Preview]</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[16px] h-[300px] items-start left-0 pb-[2px] pt-[34px] px-[34px] top-[108px] w-[887.6px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <Container8 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[28px] left-0 not-italic text-[#101828] text-[20px] top-[-2.5px] whitespace-nowrap">Description</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#364153] text-[16px] top-[-1.5px] w-[829px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#364153] text-[16px] top-[-1.5px] w-[788px]">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#364153] text-[16px] top-[-1.5px] w-[782px]">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.</p>
    </div>
  );
}

function Container9() {
  return (
    <div className="bg-white h-[220px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#99a1af] border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[12px] items-start pb-[2px] pt-[26px] px-[26px] relative size-full">
        <Paragraph />
        <Paragraph1 />
        <Paragraph2 />
      </div>
    </div>
  );
}

function Section() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[264px] items-start left-0 top-[440px] w-[887.6px]" data-name="Section">
      <Heading1 />
      <Container9 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[28px] left-0 not-italic text-[#101828] text-[20px] top-[-2.5px] whitespace-nowrap">Curriculum</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[58px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#99a1af] border-b-2 border-solid inset-0 pointer-events-none" />
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[16px] not-italic text-[#101828] text-[16px] top-[14.5px] whitespace-nowrap">Lesson 1: Introduction to Advanced Concepts</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[58px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#99a1af] border-b-2 border-solid inset-0 pointer-events-none" />
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[16px] not-italic text-[#101828] text-[16px] top-[14.5px] whitespace-nowrap">Lesson 2: Closures and Scope</p>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[58px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#99a1af] border-b-2 border-solid inset-0 pointer-events-none" />
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[16px] not-italic text-[#101828] text-[16px] top-[14.5px] whitespace-nowrap">Lesson 3: Async/Await and Promises</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[56px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[16px] not-italic text-[#101828] text-[16px] top-[14.5px] whitespace-nowrap">Lesson 4: ES6+ Features</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="bg-white h-[234px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start p-[2px] relative size-full">
        <Container11 />
        <Container12 />
        <Container13 />
        <Container14 />
      </div>
    </div>
  );
}

function Section1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[278px] items-start left-0 top-[736px] w-[887.6px]" data-name="Section">
      <Heading2 />
      <Container10 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[28px] left-0 not-italic text-[#101828] text-[20px] top-[-2.5px] whitespace-nowrap">Student Reviews</p>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[0] left-0 not-italic text-[#101828] text-[0px] top-[-1.5px] whitespace-nowrap">
        <span className="font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[24px] text-[16px]">John Doe</span>
        <span className="font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] text-[#4a5565] text-[14px]">- 5 days ago</span>
      </p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#364153] text-[16px] top-[-1.5px] w-[815px]">This course was excellent! I learned so much about JavaScript and the instructor explained everything clearly. Highly recommend to anyone looking to improve their skills.</p>
    </div>
  );
}

function Container16() {
  return (
    <div className="bg-white h-[132px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#99a1af] border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[8px] items-start pb-[2px] pt-[26px] px-[26px] relative size-full">
        <Container17 />
        <Paragraph3 />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[0] left-0 not-italic text-[#101828] text-[0px] top-[-1.5px] whitespace-nowrap">
        <span className="font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[24px] text-[16px]">Jane Smith</span>
        <span className="font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] text-[#4a5565] text-[14px]">- 2 weeks ago</span>
      </p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#364153] text-[16px] top-[-1.5px] w-[832px]">Great content and well-structured lessons. The examples were practical and easy to follow. Would definitely take more courses from this instructor.</p>
    </div>
  );
}

function Container18() {
  return (
    <div className="bg-white h-[132px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#99a1af] border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[8px] items-start pb-[2px] pt-[26px] px-[26px] relative size-full">
        <Container19 />
        <Paragraph4 />
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[280px] items-start relative shrink-0 w-full" data-name="Container">
      <Container16 />
      <Container18 />
    </div>
  );
}

function Section2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[324px] items-start left-0 top-[1046px] w-[887.6px]" data-name="Section">
      <Heading3 />
      <Container15 />
    </div>
  );
}

function Container5() {
  return (
    <div className="flex-[1_0_0] h-[1370px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Heading />
        <Container6 />
        <Container7 />
        <Section />
        <Section1 />
        <Section2 />
      </div>
    </div>
  );
}

function Container20() {
  return <div className="flex-[1_0_0] h-[1370px] min-h-px min-w-px" data-name="Container" />;
}

function CourseDetails1() {
  return (
    <div className="absolute content-stretch flex gap-[32px] h-[1370px] items-start left-[32px] top-[18px] w-[1300px]" data-name="CourseDetails">
      <Container5 />
      <Container20 />
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[40px] left-[165.07px] not-italic text-[#101828] text-[36px] text-center top-[-3px] whitespace-nowrap">$79.99</p>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_37_1769)" id="Icon">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 5V10L13.3333 11.6667" id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_37_1769">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[24px] relative shrink-0 w-[122.4px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#364153] text-[16px] top-[-1.5px] whitespace-nowrap">Duration: 8 hours</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex gap-[12px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon5 />
      <Text4 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M10 16.6667V8.33333" id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M15 16.6667V3.33333" id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M5 16.6667V13.3333" id="Vector_3" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[24px] relative shrink-0 w-[133.683px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#364153] text-[16px] top-[-1.5px] whitespace-nowrap">Level: Intermediate</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex gap-[12px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon6 />
      <Text5 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M10 5.83333V17.5" id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p25713000} id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[24px] relative shrink-0 w-[134.4px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#364153] text-[16px] top-[-1.5px] whitespace-nowrap">Format: Text-based</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex gap-[12px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon7 />
      <Text6 />
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[96px] items-start relative shrink-0 w-full" data-name="Container">
      <Container23 />
      <Container24 />
      <Container25 />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#101828] h-[64px] relative shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[28px] left-[164.68px] not-italic text-[18px] text-center text-white top-[17px] whitespace-nowrap">{`Pay & Enroll`}</p>
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[27px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[27px] left-0 not-italic text-[#101828] text-[18px] top-[-1.5px] whitespace-nowrap">This course includes:</p>
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p164f7540} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p809b580} id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[24px] relative shrink-0 w-[174.4px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#364153] text-[16px] top-[-1.5px] whitespace-nowrap">Certificate of completion</p>
      </div>
    </div>
  );
}

function ListItem() {
  return (
    <div className="content-stretch flex gap-[12px] h-[24px] items-center relative shrink-0 w-full" data-name="List Item">
      <Icon8 />
      <Text7 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_37_1760)" id="Icon">
          <path d={svgPaths.p17cc7980} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3fe63d80} id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_37_1760">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[24px] relative shrink-0 w-[105.45px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#364153] text-[16px] top-[-1.5px] whitespace-nowrap">Lifetime access</p>
      </div>
    </div>
  );
}

function ListItem1() {
  return (
    <div className="content-stretch flex gap-[12px] h-[24px] items-center relative shrink-0 w-full" data-name="List Item">
      <Icon9 />
      <Text8 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_37_1760)" id="Icon">
          <path d={svgPaths.p17cc7980} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3fe63d80} id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_37_1760">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[24px] relative shrink-0 w-[138.933px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#364153] text-[16px] top-[-1.5px] whitespace-nowrap">30-day money back</p>
      </div>
    </div>
  );
}

function ListItem2() {
  return (
    <div className="content-stretch flex gap-[12px] h-[24px] items-center relative shrink-0 w-full" data-name="List Item">
      <Icon10 />
      <Text9 />
    </div>
  );
}

function List() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[96px] items-start relative shrink-0 w-full" data-name="List">
      <ListItem />
      <ListItem1 />
      <ListItem2 />
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[165px] items-start pt-[26px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#99a1af] border-solid border-t-2 inset-0 pointer-events-none" />
      <Heading4 />
      <List />
    </div>
  );
}

function CourseDetails2() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[24px] h-[489px] items-start left-[951.6px] pb-[2px] pt-[26px] px-[26px] top-[32px] w-[380.4px]" data-name="CourseDetails">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <Container21 />
      <Container22 />
      <Button />
      <Container26 />
    </div>
  );
}

function MainContent() {
  return (
    <div className="bg-[#f9fafb] flex-[1_0_0] min-h-px min-w-px relative w-[1376px]" data-name="Main Content">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <CourseDetails1 />
        <CourseDetails2 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="flex-[1_0_0] h-[1494px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Header />
        <MainContent />
      </div>
    </div>
  );
}

export default function CourseDetails() {
  return (
    <div className="bg-white content-stretch flex items-start relative size-full" data-name="Course Details">
      <Sidebar />
      <Container1 />
    </div>
  );
}