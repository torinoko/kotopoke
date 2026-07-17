type VisibilitySettingsFormProps = {
  isPublic: boolean;
  action: (formData: FormData) => void | Promise<void>;
};

export function VisibilitySettingsForm({
  isPublic,
  action,
}: VisibilitySettingsFormProps) {
  return (
    <form action={action} className="mt-5">
      <label className="flex items-start gap-3 rounded-lg border border-stone-200 bg-[#fbf8f1] p-4">
        <input
          type="checkbox"
          name="isPublic"
          defaultChecked={isPublic}
          className="mt-1 h-5 w-5 rounded border-stone-300 text-[#5f8f86]"
        />
        <span>
          <span className="block font-medium text-stone-700">
            ことばたちを公開する
          </span>
          <span className="mt-1 block text-sm leading-6 text-stone-500">
            オンにすると、ユーザーURLから登録したことばを見られるようになります。
          </span>
        </span>
      </label>
      <button
        type="submit"
        className="mt-4 rounded-md bg-[#5f8f86] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#4f7d75]"
      >
        公開設定を保存
      </button>
    </form>
  );
}
