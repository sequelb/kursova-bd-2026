import svgPaths from "./svg-de4wcak8rk";

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
          <path d={svgPaths.p383b2000} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Layout1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[114.817px]" data-name="Layout">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-1.5px] whitespace-nowrap">Student Reviews</p>
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

function Icon2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M10 1.66667V18.3333" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3055a600} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Layout2() {
  return (
    <div className="h-[24px] relative shrink-0 w-[136.483px]" data-name="Layout">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-white top-[-1.5px] whitespace-nowrap">{`Earnings & Payouts`}</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="bg-[#101828] h-[52px] relative shrink-0 w-full" data-name="Link">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
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
    <div className="content-stretch flex h-[32px] items-start relative shrink-0 w-full" data-name="Heading 1">
      <p className="flex-[1_0_0] font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[32px] min-h-px min-w-px not-italic relative text-[#101828] text-[24px]">{`Earnings & Payouts`}</p>
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[28px] left-0 not-italic text-[#101828] text-[18px] top-[-1px] whitespace-nowrap">Available Balance</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[48px] left-0 not-italic text-[#101828] text-[48px] top-[-5px] whitespace-nowrap">$1,250.00</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[84px] relative shrink-0 w-[219.317px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Heading1 />
        <Container7 />
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#101828] h-[52px] relative shrink-0 w-[161.033px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Segoe_UI_Emoji:Medium',sans-serif] leading-[24px] left-[81px] not-italic text-[16px] text-center text-white top-[12.5px] whitespace-nowrap">Request Payout</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex h-[84px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container6 />
      <Button1 />
    </div>
  );
}

function Container4() {
  return (
    <div className="bg-white h-[136px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start pb-[2px] pt-[26px] px-[26px] relative size-full">
        <Container5 />
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[28px] left-0 not-italic text-[#101828] text-[20px] top-[-2.5px] whitespace-nowrap">Payout History</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="col-1 justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[24px] left-[24px] not-italic text-[#101828] text-[16px] top-[14.5px] whitespace-nowrap">Payout ID</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="col-2 justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[24px] left-[24px] not-italic text-[#101828] text-[16px] top-[14.5px] whitespace-nowrap">Date</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="col-3 justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[24px] left-[24px] not-italic text-[#101828] text-[16px] top-[14.5px] whitespace-nowrap">Amount ($)</p>
    </div>
  );
}

function Container13() {
  return (
    <div className="col-4 justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <p className="absolute font-['Segoe_UI_Emoji:Bold',sans-serif] leading-[24px] left-[24px] not-italic text-[#101828] text-[16px] top-[14.5px] whitespace-nowrap">Status</p>
    </div>
  );
}

function Container9() {
  return (
    <div className="bg-[#f3f4f6] grid grid-cols-[repeat(4,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[58px] pb-[2px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#1e2939] border-b-2 border-solid inset-0 pointer-events-none" />
      <Container10 />
      <Container11 />
      <Container12 />
      <Container13 />
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute h-[56px] left-0 top-0 w-[327px]" data-name="Container">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[24px] not-italic text-[#101828] text-[16px] top-[14.5px] whitespace-nowrap">PO-001</p>
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute h-[56px] left-[327px] top-0 w-[327px]" data-name="Container">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[24px] not-italic text-[#101828] text-[16px] top-[14.5px] whitespace-nowrap">2026-03-01</p>
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute h-[56px] left-[654px] top-0 w-[327px]" data-name="Container">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[24px] not-italic text-[#101828] text-[16px] top-[14.5px] whitespace-nowrap">$450.00</p>
    </div>
  );
}

function Text() {
  return (
    <div className="absolute bg-[#101828] content-stretch flex h-[33px] items-start left-[1005px] px-[14px] py-[6px] top-[11.5px] w-[105.917px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <p className="font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">Completed</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[58px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#99a1af] border-b-2 border-solid inset-0 pointer-events-none" />
      <Container15 />
      <Container16 />
      <Container17 />
      <Text />
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute h-[56px] left-0 top-0 w-[327px]" data-name="Container">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[24px] not-italic text-[#101828] text-[16px] top-[14.5px] whitespace-nowrap">PO-002</p>
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute h-[56px] left-[327px] top-0 w-[327px]" data-name="Container">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[24px] not-italic text-[#101828] text-[16px] top-[14.5px] whitespace-nowrap">2026-02-15</p>
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute h-[56px] left-[654px] top-0 w-[327px]" data-name="Container">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[24px] not-italic text-[#101828] text-[16px] top-[14.5px] whitespace-nowrap">$320.50</p>
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute bg-[#101828] content-stretch flex h-[33px] items-start left-[1005px] px-[14px] py-[6px] top-[11.5px] w-[105.917px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <p className="font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">Completed</p>
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[58px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#99a1af] border-b-2 border-solid inset-0 pointer-events-none" />
      <Container19 />
      <Container20 />
      <Container21 />
      <Text1 />
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute h-[56px] left-0 top-0 w-[327px]" data-name="Container">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[24px] not-italic text-[#101828] text-[16px] top-[14.5px] whitespace-nowrap">PO-003</p>
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute h-[56px] left-[327px] top-0 w-[327px]" data-name="Container">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[24px] not-italic text-[#101828] text-[16px] top-[14.5px] whitespace-nowrap">2026-02-01</p>
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute h-[56px] left-[654px] top-0 w-[327px]" data-name="Container">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[24px] not-italic text-[#101828] text-[16px] top-[14.5px] whitespace-nowrap">$580.00</p>
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute bg-[#101828] content-stretch flex h-[33px] items-start left-[1005px] px-[14px] py-[6px] top-[11.5px] w-[105.917px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <p className="font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">Completed</p>
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[58px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#99a1af] border-b-2 border-solid inset-0 pointer-events-none" />
      <Container23 />
      <Container24 />
      <Container25 />
      <Text2 />
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute h-[56px] left-0 top-0 w-[327px]" data-name="Container">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[24px] not-italic text-[#101828] text-[16px] top-[14.5px] whitespace-nowrap">PO-004</p>
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute h-[56px] left-[327px] top-0 w-[327px]" data-name="Container">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[24px] not-italic text-[#101828] text-[16px] top-[14.5px] whitespace-nowrap">2026-01-28</p>
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute h-[56px] left-[654px] top-0 w-[327px]" data-name="Container">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[24px] not-italic text-[#101828] text-[16px] top-[14.5px] whitespace-nowrap">$225.00</p>
    </div>
  );
}

function Text3() {
  return (
    <div className="absolute bg-[#f3f4f6] content-stretch flex h-[33px] items-start left-[1005px] px-[14px] py-[6px] top-[11.5px] w-[85.55px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-2 border-[#99a1af] border-solid inset-0 pointer-events-none" />
      <p className="font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#101828] text-[16px] whitespace-nowrap">Pending</p>
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[56px] relative shrink-0 w-full" data-name="Container">
      <Container27 />
      <Container28 />
      <Container29 />
      <Text3 />
    </div>
  );
}

function Container8() {
  return (
    <div className="bg-white h-[292px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start p-[2px] relative size-full">
        <Container9 />
        <Container14 />
        <Container18 />
        <Container22 />
        <Container26 />
      </div>
    </div>
  );
}

function Section() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[336px] items-start relative shrink-0 w-full" data-name="Section">
      <Heading2 />
      <Container8 />
    </div>
  );
}

function Earnings() {
  return (
    <div className="h-[632px] relative shrink-0 w-full" data-name="Earnings">
      <div className="content-stretch flex flex-col gap-[32px] items-start pt-[32px] px-[32px] relative size-full">
        <Heading />
        <Container4 />
        <Section />
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div className="bg-[#f9fafb] flex-[1_0_0] min-h-px min-w-px relative w-[1376px]" data-name="Main Content">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <Earnings />
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

export default function Payouts() {
  return (
    <div className="bg-white content-stretch flex items-start relative size-full" data-name="Payouts">
      <Sidebar />
      <Container1 />
    </div>
  );
}