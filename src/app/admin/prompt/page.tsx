// app/admin/prompt/page.tsx
'use client';

import useSWR, { useSWRConfig } from 'swr';
import Link from 'next/link';

type ModelsResponse = {
  models: string[];
};

type PromptTemplatesResponse = {
  templates: {
    id: string;
    label: string;
    systemPrompt: string;
    userPrompt: string;
    model: string;
    instructions: string;
    temperature: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const bodyText = await res.text();
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
  return JSON.parse(bodyText);
};

export default function AdminDeityPage() {
  const {
    data: modelsData,
    error: modelsError,
    isLoading: modelsLoading,
  } = useSWR<ModelsResponse>('/api/ai/models', fetcher);
  const {
    data: templatesData,
    error: templatesError,
    isLoading: templatesLoading,
  } = useSWR<PromptTemplatesResponse>('/api/ai/prompt-templates', fetcher);
  const { mutate } = useSWRConfig();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">プロンプト管理ページ</h1>

      <nav className="mb-6 space-x-4">
        <Link href="/admin" className="text-blue-500 hover:underline">
          ← 管理トップへ戻る
        </Link>
      </nav>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">利用可能な OpenAI モデル一覧</h2>
        {modelsError && <p className="text-red-500">モデル一覧の取得に失敗しました。</p>}
        {modelsLoading && <p>読み込み中…</p>}
        {modelsData && (
          <div className="h-40 overflow-y-scroll">
            <ul className="list-disc pl-5 space-y-1">
              {modelsData.models.map((model) => (
                <li key={model} className="break-all">
                  {model}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-2">プロンプトテンプレート一覧</h2>
        {templatesError && <p className="text-red-500">テンプレート一覧の取得に失敗しました。</p>}
        {templatesLoading && <p>読み込み中…</p>}
        {templatesData && (
          <div className="h-40 overflow-y-scroll">
            <ul className="list-disc pl-5 space-y-1">
              {templatesData.templates.map((template) => (
                <li
                  key={template.id}
                  className="break-all cursor-pointer text-blue-500 hover:underline"
                  onClick={() => {
                    const form = document.querySelector('form');
                    if (form) {
                      const idInput = form.querySelector('input[name="id"]');
                      const labelInput = form.querySelector('input[name="label"]');
                      const systemPrompt = form.querySelector('textarea[name="systemPrompt"]');
                      const userPrompt = form.querySelector('textarea[name="userPrompt"]');
                      const instructions = form.querySelector('textarea[name="instructions"]');
                      const model = form.querySelector('input[name="model"]');
                      const temperature = form.querySelector('input[name="temperature"]');
                      if (
                        idInput &&
                        labelInput &&
                        systemPrompt &&
                        userPrompt &&
                        instructions &&
                        model &&
                        temperature
                      ) {
                        (idInput as HTMLInputElement).value = template.id;
                        (labelInput as HTMLInputElement).value = template.label;
                        (systemPrompt as HTMLTextAreaElement).value = template.systemPrompt;
                        (userPrompt as HTMLTextAreaElement).value = template.userPrompt;
                        (instructions as HTMLTextAreaElement).value = template.instructions;
                        (model as HTMLInputElement).value = template.model;
                        (temperature as HTMLInputElement).value = template.temperature.toString();
                        // const testSystemPrompt = form.querySelector(
                        //   '#test textarea[name="systemPrompt"]'
                        // ) as HTMLTextAreaElement;
                        systemPrompt.dispatchEvent(new Event('input', { bubbles: true }));
                      }
                    }
                  }}
                >
                  {template.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section id="test" className="mt-8">
        <h2 className="text-xl font-semibold mb-2">プロンプトのテスト</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const testData = {
              model: (formData.get('model') as string).trim(),
              systemPrompt: formData.get('systemPrompt') as string,
              userPrompt: formData.get('userPrompt') as string,
              instructions: formData.get('instructions') as string,
              temperature: parseFloat(formData.get('temperature') as string),
            };

            const res = await fetch('/api/ai/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(testData),
            });

            const json = await res.json();
            if (res.ok && json.reply) {
              alert(json.reply);
              console.log(json);
            } else {
              alert(`エラー: ${json.error || 'お告げが届きませんでした'}`);
            }
          }}
        >
          <input type="hidden" name="id" value="固定ID" />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">label</label>

            <input
              name="label"
              readOnly
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">systemPrompt</label>
            <textarea
              name="systemPrompt"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                const charCount = target.value.length;
                const charCountDisplay = document.getElementById('systemPromptCharCount');
                if (charCountDisplay) {
                  charCountDisplay.textContent = `文字数: ${charCount}`;
                }
              }}
            />
            <div id="systemPromptCharCount" className="text-sm text-gray-500 mt-1">
              文字数: 0
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">userPrompt</label>
            <textarea
              name="userPrompt"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">instructions</label>
            <textarea
              name="instructions"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">model</label>
            <input
              name="model"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">temperature</label>
            <input
              name="temperature"
              type="number"
              step="0.1"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button
            type="button"
            onClick={async () => {
              const formData = new FormData(document.querySelector('form') as HTMLFormElement);
              const templateData = {
                id: formData.get('id'), // Assuming there's a hidden input for id
                label: formData.get('label'),
                systemPrompt: formData.get('systemPrompt'),
                userPrompt: formData.get('userPrompt'),
                model: formData.get('model'),
                instructions: formData.get('instructions'),
                temperature: parseFloat(formData.get('temperature') as string),
              };

              const response = await fetch('/api/ai/prompt-templates', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(templateData),
              });

              if (response.ok) {
                alert('テンプレートが更新されました。');
                await mutate('/api/ai/prompt-templates');
              } else {
                console.error('テンプレートの更新に失敗しました。');
              }
            }}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ml-2"
          >
            更新
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            テスト実行
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">プロンプトのテンプレート作成</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const templateData = {
              label: formData.get('label'),
              systemPrompt: formData.get('systemPrompt'),
              userPrompt: formData.get('userPrompt'),
              model: formData.get('model'),
              instructions: formData.get('instructions'),
              temperature: parseFloat(formData.get('temperature') as string),
            };

            const response = await fetch('/api/ai/prompt-templates', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(templateData),
            });

            if (response.ok) {
              (e.target as HTMLFormElement).reset();
              await mutate('/api/ai/prompt-templates');
            } else {
              console.error('テンプレートの作成に失敗しました。');
            }
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">label</label>
            <textarea
              name="label"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">systemPrompt</label>
            <textarea
              name="systemPrompt"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">userPrompt</label>
            <textarea
              name="userPrompt"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">instructions</label>
            <textarea
              name="instructions"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">model</label>
            <textarea
              name="model"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">temperature</label>
            <input
              name="temperature"
              type="number"
              step="0.1"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            新規作成
          </button>
        </form>
      </section>
    </div>
  );
}
