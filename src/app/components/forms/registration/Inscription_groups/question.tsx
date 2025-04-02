import React, { ChangeEvent } from 'react';

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  error
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3 py-2 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

interface GroupFormProps {
  groupName: string;
  onGroupNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  members: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  onAddMember: () => void;
  onRemoveMember: (id: string) => void;
  onMemberChange: (id: string, field: string, value: string) => void;
  errors?: {
    groupName?: string;
    members?: Record<string, { name?: string; email?: string }>;
  };
}

export const GroupForm: React.FC<GroupFormProps> = ({
  groupName,
  onGroupNameChange,
  members,
  onAddMember,
  onRemoveMember,
  onMemberChange,
  errors = {}
}) => {
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del Grupo <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="groupName"
          name="groupName"
          value={groupName}
          onChange={onGroupNameChange}
          required
          className={`w-full px-3 py-2 border ${
            errors.groupName ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500`}
        />
        {errors.groupName && <p className="mt-1 text-sm text-red-500">{errors.groupName}</p>}
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Miembros</h3>
        {members.map((member, index) => (
          <div key={member.id} className="p-4 bg-gray-50 rounded-md mb-4">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-md font-medium">Miembro {index + 1}</h4>
              <button
                type="button"
                onClick={() => onRemoveMember(member.id)}
                className="text-red-500 hover:text-red-700"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label 
                  htmlFor={`member-${member.id}-name`} 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id={`member-${member.id}-name`}
                  value={member.name}
                  onChange={(e) => onMemberChange(member.id, 'name', e.target.value)}
                  required
                  className={`w-full px-3 py-2 border ${
                    errors.members?.[member.id]?.name ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500`}
                />
                {errors.members?.[member.id]?.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.members[member.id].name}</p>
                )}
              </div>

              <div>
                <label 
                  htmlFor={`member-${member.id}-email`} 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Correo electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id={`member-${member.id}-email`}
                  value={member.email}
                  onChange={(e) => onMemberChange(member.id, 'email', e.target.value)}
                  required
                  className={`w-full px-3 py-2 border ${
                    errors.members?.[member.id]?.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500`}
                />
                {errors.members?.[member.id]?.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.members[member.id].email}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={onAddMember}
          className="flex items-center justify-center w-full px-4 py-2 bg-gray-200 rounded-md text-gray-800 hover:bg-gray-300 transition-colors"
        >
          <div 
            className="h-5 w-5 mr-2"
            style={{
              backgroundImage: "url('/icons/add-member-icon.svg')",
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat"
            }}
          ></div>
          Añadir miembro
        </button>
      </div>
    </div>
  );
};

export default {
  InputField,
  GroupForm
};