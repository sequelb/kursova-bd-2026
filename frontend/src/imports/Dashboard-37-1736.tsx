import svgPaths from "./svg-bj5mfpo1wh";

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
          <path d={svgPaths.pd2ce200} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M18.3333 8.33333V13.3333" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1ead9c00} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Layout() {
  return (
    <div className="h-[24px] relative shrink-0 w-[87.5px]" data-name="Layout">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-white top-[-1.5px] whitespace-nowrap">My Learning</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="bg-[#101828] h-[52px] relative shrink-0 w-full" data-name="Link">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
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

function Heading() {
  return (
    <div className="content-stretch flex h-[32px] items-start relative shrink-0 w-full" data-name="Heading 2">
      <p className="flex-[1_0_0] font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[32px] min-h-px min-w-px not-italic relative text-[#101828] text-[24px]">My Learning Progress</p>
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[27px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[27px] left-0 not-italic text-[#101828] text-[18px] top-[-1.5px] whitespace-nowrap">React for Beginners</p>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[20px] relative shrink-0 w-[53.2px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-1.5px] whitespace-nowrap">Progress</p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[28.233px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[-1.5px] whitespace-nowrap">60%</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between relative size-full">
          <Text />
          <Text1 />
        </div>
      </div>
    </div>
  );
}

function Container12() {
  return <div className="bg-[#101828] h-[12px] shrink-0 w-full" data-name="Container" />;
}

function Container11() {
  return (
    <div className="bg-[#f3f4f6] h-[16px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start pl-[2px] pr-[422.65px] py-[2px] relative size-full">
        <Container12 />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[40px] items-start relative shrink-0 w-full" data-name="Container">
      <Container10 />
      <Container11 />
    </div>
  );
}

function Container8() {
  return (
    <div className="flex-[1_0_0] h-[91px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start relative size-full">
        <Heading1 />
        <Container9 />
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="bg-[#101828] h-[44px] relative shrink-0 w-[168.383px]" data-name="Link">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[26px] not-italic text-[16px] text-white top-[8.5px] whitespace-nowrap">Continue Lesson</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex h-[91px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container8 />
      <Link2 />
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-white h-[143px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start pb-[2px] pt-[26px] px-[26px] relative size-full">
        <Container7 />
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[27px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[27px] left-0 not-italic text-[#101828] text-[18px] top-[-1.5px] whitespace-nowrap">Python Programming Basics</p>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[53.2px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-1.5px] whitespace-nowrap">Progress</p>
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[28.233px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[-1.5px] whitespace-nowrap">35%</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between relative size-full">
          <Text2 />
          <Text3 />
        </div>
      </div>
    </div>
  );
}

function Container19() {
  return <div className="bg-[#101828] h-[12px] shrink-0 w-full" data-name="Container" />;
}

function Container18() {
  return (
    <div className="bg-[#f3f4f6] h-[16px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start pl-[2px] pr-[685.567px] py-[2px] relative size-full">
        <Container19 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[40px] items-start relative shrink-0 w-full" data-name="Container">
      <Container17 />
      <Container18 />
    </div>
  );
}

function Container15() {
  return (
    <div className="flex-[1_0_0] h-[91px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start relative size-full">
        <Heading2 />
        <Container16 />
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="bg-[#101828] h-[44px] relative shrink-0 w-[168.383px]" data-name="Link">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[26px] not-italic text-[16px] text-white top-[8.5px] whitespace-nowrap">Continue Lesson</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex h-[91px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container15 />
      <Link3 />
    </div>
  );
}

function Container13() {
  return (
    <div className="bg-white h-[143px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start pb-[2px] pt-[26px] px-[26px] relative size-full">
        <Container14 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[302px] items-start relative shrink-0 w-full" data-name="Container">
      <Container6 />
      <Container13 />
    </div>
  );
}

function Section() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] h-[358px] items-start relative shrink-0 w-full" data-name="Section">
      <Heading />
      <Container5 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-start left-0 top-0 w-[1300px]" data-name="Heading 2">
      <p className="flex-[1_0_0] font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[32px] min-h-px min-w-px not-italic relative text-[#101828] text-[24px]">Recommended Courses</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[20px] left-0 top-[56px] w-[1300px]" data-name="Paragraph">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-1.5px] whitespace-nowrap">(Algorithmic suggestions)</p>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[20px] relative shrink-0 w-[122.8px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#6a7282] text-[14px] top-[-1.5px] whitespace-nowrap">[Image Placeholder]</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute bg-[#e5e7eb] content-stretch flex h-[160px] items-center justify-center left-[16px] p-[2px] top-[16px] w-[381.333px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#99a1af] border-solid inset-0 pointer-events-none" />
      <Text4 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="absolute h-[27px] left-[16px] top-[192px] w-[381.333px]" data-name="Heading 3">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[27px] left-0 not-italic text-[#101828] text-[18px] top-[-1.5px] whitespace-nowrap">Introduction to Web Development</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[227px] w-[381.333px]" data-name="Paragraph">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-1.5px] whitespace-nowrap">Teacher: John Smith</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute h-[24px] left-[16px] top-[255px] w-[381.333px]" data-name="Paragraph">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-1.5px] whitespace-nowrap">$49.99</p>
    </div>
  );
}

function Link4() {
  return (
    <div className="absolute bg-[#101828] border-2 border-[#1e2939] border-solid h-[44px] left-[16px] top-[295px] w-[381.333px]" data-name="Link">
      <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[189.28px] not-italic text-[16px] text-center text-white top-[6.5px] whitespace-nowrap">View</p>
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute bg-white border-2 border-[#1e2939] border-solid h-[359px] left-0 top-0 w-[417.333px]" data-name="Container">
      <Container22 />
      <Heading4 />
      <Paragraph1 />
      <Paragraph2 />
      <Link4 />
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[20px] relative shrink-0 w-[122.8px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#6a7282] text-[14px] top-[-1.5px] whitespace-nowrap">[Image Placeholder]</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute bg-[#e5e7eb] content-stretch flex h-[160px] items-center justify-center left-[16px] p-[2px] top-[16px] w-[381.333px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#99a1af] border-solid inset-0 pointer-events-none" />
      <Text5 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="absolute h-[27px] left-[16px] top-[192px] w-[381.333px]" data-name="Heading 3">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[27px] left-0 not-italic text-[#101828] text-[18px] top-[-1.5px] whitespace-nowrap">Advanced JavaScript Concepts</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[227px] w-[381.333px]" data-name="Paragraph">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-1.5px] whitespace-nowrap">Teacher: Sarah Johnson</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="absolute h-[24px] left-[16px] top-[255px] w-[381.333px]" data-name="Paragraph">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-1.5px] whitespace-nowrap">$79.99</p>
    </div>
  );
}

function Link5() {
  return (
    <div className="absolute bg-[#101828] border-2 border-[#1e2939] border-solid h-[44px] left-[16px] top-[295px] w-[381.333px]" data-name="Link">
      <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[189.28px] not-italic text-[16px] text-center text-white top-[6.5px] whitespace-nowrap">View</p>
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute bg-white border-2 border-[#1e2939] border-solid h-[359px] left-[441.33px] top-0 w-[417.333px]" data-name="Container">
      <Container24 />
      <Heading5 />
      <Paragraph3 />
      <Paragraph4 />
      <Link5 />
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[20px] relative shrink-0 w-[122.8px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#6a7282] text-[14px] top-[-1.5px] whitespace-nowrap">[Image Placeholder]</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute bg-[#e5e7eb] content-stretch flex h-[160px] items-center justify-center left-[16px] p-[2px] top-[16px] w-[381.333px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#99a1af] border-solid inset-0 pointer-events-none" />
      <Text6 />
    </div>
  );
}

function Heading6() {
  return (
    <div className="absolute h-[27px] left-[16px] top-[192px] w-[381.333px]" data-name="Heading 3">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[27px] left-0 not-italic text-[#101828] text-[18px] top-[-1.5px] whitespace-nowrap">UI/UX Design Fundamentals</p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[227px] w-[381.333px]" data-name="Paragraph">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-1.5px] whitespace-nowrap">Teacher: Michael Brown</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="absolute h-[24px] left-[16px] top-[255px] w-[381.333px]" data-name="Paragraph">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-1.5px] whitespace-nowrap">$59.99</p>
    </div>
  );
}

function Link6() {
  return (
    <div className="absolute bg-[#101828] border-2 border-[#1e2939] border-solid h-[44px] left-[16px] top-[295px] w-[381.333px]" data-name="Link">
      <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[189.28px] not-italic text-[16px] text-center text-white top-[6.5px] whitespace-nowrap">View</p>
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute bg-white border-2 border-[#1e2939] border-solid h-[359px] left-[882.67px] top-0 w-[417.333px]" data-name="Container">
      <Container26 />
      <Heading6 />
      <Paragraph5 />
      <Paragraph6 />
      <Link6 />
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute h-[359px] left-0 top-[92px] w-[1300px]" data-name="Container">
      <Container21 />
      <Container23 />
      <Container25 />
    </div>
  );
}

function Section1() {
  return (
    <div className="h-[451px] relative shrink-0 w-full" data-name="Section">
      <Heading3 />
      <Paragraph />
      <Container20 />
    </div>
  );
}

function Dashboard1() {
  return (
    <div className="h-[921px] relative shrink-0 w-full" data-name="Dashboard">
      <div className="content-stretch flex flex-col gap-[48px] items-start pt-[32px] px-[32px] relative size-full">
        <Section />
        <Section1 />
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div className="bg-[#f9fafb] flex-[1_0_0] min-h-px min-w-px relative w-[1376px]" data-name="Main Content">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pr-[12px] pt-[-14px] relative rounded-[inherit] size-full">
        <Dashboard1 />
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

export default function Dashboard() {
  return (
    <div className="bg-white content-stretch flex items-start relative size-full" data-name="Dashboard">
      <Sidebar />
      <Container1 />
    </div>
  );
}