import { GroupId, GROUP_TEMPLATES } from '@/lib/groupTemplates';

interface GroupSelectorProps {
  selectedGroup: GroupId | null;
  onSelect: (group: GroupId) => void;
}

export default function GroupSelector({ selectedGroup, onSelect }: GroupSelectorProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {GROUP_TEMPLATES.map((group) => {
        const isActive = selectedGroup === group.id;
        return (
          <button
            key={group.id}
            type="button"
            onClick={() => onSelect(group.id)}
            className={
              isActive
                ? 'px-4 py-2 rounded-lg border-2 border-blue-500 bg-blue-500 text-white font-semibold transition-colors'
                : 'px-4 py-2 rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-semibold hover:border-blue-300 hover:bg-blue-50 transition-colors'
            }
          >
            {group.label}
          </button>
        );
      })}
    </div>
  );
}
