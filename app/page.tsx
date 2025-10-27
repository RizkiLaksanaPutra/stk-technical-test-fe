const page = () => {
  return (
    <div>
      <div className="flex items-center gap-2 py-[33px] font-medium">
        <img src="/folder-gray.svg" />
        <div className="text-blue-gray-300">/</div>
        <div>Menus</div>
      </div>
      <div className="flex items-center gap-4">
        <div className="bg-blue-primary flex size-[52px] items-center justify-center rounded-full">
          <img src="/squares-white.svg" />
        </div>
        <div className="text-[32px]">Menus</div>
      </div>
    </div>
  );
};

export default page;
