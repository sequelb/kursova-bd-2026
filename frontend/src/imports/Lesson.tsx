import svgPaths from "./svg-rgbfw5bdu4";

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
    <div className="bg-[#f3f4f6] h-[985px] relative shrink-0 w-[256px]" data-name="Sidebar">
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

function Icon4() {
  return (
    <div className="absolute left-[377.8px] size-[64px] top-0" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
        <g id="Icon">
          <path d={svgPaths.p3f6fb600} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.33333" />
          <path d={svgPaths.p29192380} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.33333" />
          <path d="M26.6667 24H21.3333" id="Vector_3" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.33333" />
          <path d="M42.6667 34.6667H21.3333" id="Vector_4" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.33333" />
          <path d="M42.6667 45.3333H21.3333" id="Vector_5" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[100px] relative shrink-0 w-full" data-name="Container">
      <Icon4 />
      <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[28px] left-[409.63px] not-italic text-[#6a7282] text-[18px] text-center top-[71px] whitespace-nowrap">[Text-based Lesson Content]</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[78px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[26px] left-0 not-italic text-[#364153] text-[16px] top-[-1.5px] w-[796px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[52px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[26px] left-0 not-italic text-[#364153] text-[16px] top-[-1.5px] w-[788px]">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[52px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[26px] left-0 not-italic text-[#364153] text-[16px] top-[-1.5px] w-[782px]">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[52px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[26px] left-0 not-italic text-[#364153] text-[16px] top-[-1.5px] w-[813px]">Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[282px] items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph />
      <Paragraph1 />
      <Paragraph2 />
      <Paragraph3 />
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[24px] h-[474px] items-start left-0 pb-[2px] pt-[34px] px-[34px] top-[68px] w-[887.6px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <Container7 />
      <Container8 />
    </div>
  );
}

function Heading() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-start left-0 top-0 w-[887.6px]" data-name="Heading 1">
      <p className="flex-[1_0_0] font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[32px] min-h-px min-w-px not-italic relative text-[#101828] text-[24px]">Lesson 3: Advanced Topics</p>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M12.5 15L7.5 10L12.5 5" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Medium',sans-serif] leading-[24px] left-[56.5px] not-italic text-[#101828] text-[16px] text-center top-[-1.5px] whitespace-nowrap">Previous Lesson</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white h-[52px] relative shrink-0 w-[191.95px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[26px] py-[2px] relative size-full">
        <Icon5 />
        <Text />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[85.383px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Medium',sans-serif] leading-[24px] left-[43.5px] not-italic text-[#101828] text-[16px] text-center top-[-1.5px] whitespace-nowrap">Next Lesson</p>
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M7.5 15L12.5 10L7.5 5" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-white h-[52px] relative shrink-0 w-[165.383px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center pl-[26px] pr-[2px] py-[2px] relative size-full">
        <Text1 />
        <Icon6 />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute content-stretch flex gap-[16px] h-[52px] items-start left-[3px] top-[574px] w-[887.6px]" data-name="Container">
      <Button />
      <Button1 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[27px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[27px] left-0 not-italic text-[#101828] text-[18px] top-[-1.5px] whitespace-nowrap">Finished the course?</p>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pa6d0980} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[24px] relative shrink-0 w-[212.4px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Medium',sans-serif] leading-[24px] left-[106px] not-italic text-[16px] text-center text-white top-[-1.5px] whitespace-nowrap">{`Leave a Review & Rate Course`}</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#101828] h-[52px] relative shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[8px] items-center justify-center p-[2px] relative size-full">
          <Icon7 />
          <Text2 />
        </div>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute bg-[#f3f4f6] content-stretch flex flex-col gap-[12px] h-[143px] items-start left-[3px] pb-[2px] pt-[26px] px-[26px] top-[658px] w-[887.6px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <Heading2 />
      <Button2 />
    </div>
  );
}

function Container5() {
  return (
    <div className="flex-[1_0_0] h-[957px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container6 />
        <Heading />
        <Container9 />
        <Container10 />
      </div>
    </div>
  );
}

function Container11() {
  return <div className="flex-[1_0_0] h-[957px] min-h-px min-w-px" data-name="Container" />;
}

function LessonPlayer() {
  return (
    <div className="absolute content-stretch flex gap-[32px] h-[957px] items-start left-[32px] top-[32px] w-[1300px]" data-name="LessonPlayer">
      <Container5 />
      <Container11 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[30px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[30px] left-0 not-italic text-[#101828] text-[20px] top-[-2.5px] whitespace-nowrap">Course Content</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="bg-[#f3f4f6] h-[64px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#1e2939] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start pb-[2px] pt-[16px] px-[16px] relative size-full">
        <Heading1 />
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.32%_8.32%_8.35%_8.34%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3334 18.3334">
            <path d={svgPaths.pd03f500} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[16.67%_8.33%_41.67%_37.5%]" data-name="Vector">
        <div className="absolute inset-[-10%_-7.69%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.5 10">
            <path d={svgPaths.pafc1d00} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon8 />
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[136.483px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[-1.5px] whitespace-nowrap">Lesson 1: Introduction</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[54px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#99a1af] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pb-[2px] pl-[16px] relative size-full">
          <Container15 />
          <Text3 />
        </div>
      </div>
    </div>
  );
}

function Icon9() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.32%_8.32%_8.35%_8.34%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3334 18.3334">
            <path d={svgPaths.pd03f500} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[16.67%_8.33%_41.67%_37.5%]" data-name="Vector">
        <div className="absolute inset-[-10%_-7.69%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.5 10">
            <path d={svgPaths.pafc1d00} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon9 />
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[20px] relative shrink-0 w-[150.5px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[-1.5px] whitespace-nowrap">Lesson 2: Core Concepts</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[54px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#99a1af] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pb-[2px] pl-[16px] relative size-full">
          <Container17 />
          <Text4 />
        </div>
      </div>
    </div>
  );
}

function Icon10() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-5%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 18.3333">
            <path d={svgPaths.p26091d00} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_16.67%_66.67%_58.33%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.66667 6.66667">
            <path d={svgPaths.p1d33bb00} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[37.5%_58.33%_62.5%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.83px_-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.33333 1.66667">
            <path d="M2.5 0.833333H0.833333" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[54.17%_33.33%_45.83%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.83px_-12.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.33333 1.66667">
            <path d="M7.5 0.833333H0.833333" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[70.83%_33.33%_29.17%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.83px_-12.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.33333 1.66667">
            <path d="M7.5 0.833333H0.833333" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon10 />
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[20px] relative shrink-0 w-[173.45px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[-1.5px] whitespace-nowrap">Lesson 3: Advanced Topics</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="bg-[#e5e7eb] h-[54px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#101828] border-b-2 border-l-4 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pb-[2px] pl-[20px] relative size-full">
          <Container19 />
          <Text5 />
        </div>
      </div>
    </div>
  );
}

function Icon11() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[45.83%_12.5%_8.33%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-9.09%_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 10.8333">
            <path d={svgPaths.p22c1500} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_29.17%_54.17%_29.17%]" data-name="Vector">
        <div className="absolute inset-[-11.11%_-10%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 9.16667">
            <path d={svgPaths.p3e02e700} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon11 />
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[20px] relative shrink-0 w-[172.917px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#6a7282] text-[14px] top-[-1.5px] whitespace-nowrap">Lesson 4: Practical Examples</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[54px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#99a1af] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pb-[2px] pl-[16px] relative size-full">
          <Container21 />
          <Text6 />
        </div>
      </div>
    </div>
  );
}

function Icon12() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[45.83%_12.5%_8.33%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-9.09%_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 10.8333">
            <path d={svgPaths.p22c1500} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_29.17%_54.17%_29.17%]" data-name="Vector">
        <div className="absolute inset-[-11.11%_-10%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 9.16667">
            <path d={svgPaths.p3e02e700} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon12 />
      </div>
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[20px] relative shrink-0 w-[135.417px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#6a7282] text-[14px] top-[-1.5px] whitespace-nowrap">Lesson 5: Final Project</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[52px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[16px] relative size-full">
          <Container23 />
          <Text7 />
        </div>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col h-[268px] items-start relative shrink-0 w-full" data-name="Container">
      <Container14 />
      <Container16 />
      <Container18 />
      <Container20 />
      <Container22 />
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#364153] text-[14px] top-[-1.5px] whitespace-nowrap">Course Progress</p>
    </div>
  );
}

function Container28() {
  return <div className="bg-[#101828] h-[8px] shrink-0 w-full" data-name="Container" />;
}

function Container27() {
  return (
    <div className="bg-[#f3f4f6] flex-[1_0_0] h-[12px] min-h-px min-w-px relative" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[2px] pr-[184.5px] py-[2px] relative size-full">
        <Container28 />
      </div>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[20px] relative shrink-0 w-[28.233px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[-1.5px] whitespace-nowrap">40%</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center relative size-full">
          <Container27 />
          <Text8 />
        </div>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="bg-[#f3f4f6] h-[82px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#1e2939] border-solid border-t-2 inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[8px] items-start pt-[18px] px-[16px] relative size-full">
        <Container25 />
        <Container26 />
      </div>
    </div>
  );
}

function LessonPlayer1() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[418px] items-start left-[951.6px] p-[2px] top-[32px] w-[380.4px]" data-name="LessonPlayer">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <Container12 />
      <Container13 />
      <Container24 />
    </div>
  );
}

function MainContent() {
  return (
    <div className="bg-[#f9fafb] h-[907px] relative shrink-0 w-[1376px]" data-name="Main Content">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <LessonPlayer />
        <LessonPlayer1 />
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

export default function Lesson() {
  return (
    <div className="bg-white content-stretch flex items-start relative size-full" data-name="Lesson">
      <Sidebar />
      <Container1 />
    </div>
  );
}