import { useEffect, useState } from 'react';
import { 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Download,
  ExternalLink,
  Info,
  ArrowUpDown,
  Search
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { toast } from '../../components/ui/Toaster';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useProject } from '../../context/projectContext';

// Types for requirements
type RequirementType = 'F' | 'NF';
type MoSCoWPriority = 'M' | 'S' | 'C' | 'W';

interface Requirement {
  id: string;
  title: string;
  description: string;
  type: RequirementType;
  priority: 1 | 2 | 3 | 4 | 5;
  moscow: MoSCoWPriority;
  source?: string;
  notes?: string;
  isComplete: boolean;
}

const RequirementEditor = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<RequirementType | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<number | 'ALL'>('ALL');
  const [isEditing, setIsEditing] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<Requirement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Get requirements from project context
  const { requirementsList, setRequirementsList } = useProject();
  
  // Transform requirements from context to our frontend format
  const requirements: Requirement[] = requirementsList.flatMap(doc => 
    doc.requirements.map((req, index) => ({
      id: `RF-${String(index + 1).padStart(3, '0')}`,
      title: req.feature,
      description: req.description,
      type: (req.type || 'F') as RequirementType,
      priority: parseInt(req.priority?.toString() || '3') as 1 | 2 | 3 | 4 | 5,
      moscow: (req.moscow || 'C') as MoSCoWPriority,
      source: req.question, // Using question as source
      isComplete: false // Default value
    }))
  );

  const [filteredRequirements, setFilteredRequirements] = useState<Requirement[]>(requirements);
  
  useEffect(() => {
    const fetchRequirements = async () => {
      const projectId = localStorage.getItem('projectid');
      const token = localStorage.getItem('token');
      
      if (!projectId || !token) {
        setError('Project ID or authentication token not found.');
        setIsLoading(false);
        return;
      }
  
      setIsLoading(true);
      
      try {
        console.log('projectid',projectId);
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/extract/requirements`,
          {projectId},
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          }
        );
  
        if (response.status === 200) {
          console.log('Requirements fetched successfully:', response.data);
          setError(null);
          
          // Update the requirements in the project context
          if (response.data.requirements) {
            setRequirementsList([response.data.requirements]);
            localStorage.setItem('requirements', JSON.stringify([response.data.requirements]));
          }
        } else {
          console.error('Failed to fetch requirements:', response.data);
          setError(response.data.message || 'Failed to fetch requirements.');
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
        setError(errorMessage);
        console.error('Fetch requirements error:', error.response?.data || error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchRequirements();
  }, []);
  
  // Update filtered requirements when requirements change
  useEffect(() => {
    setFilteredRequirements(requirements);
    filterRequirements();
  }, [requirementsList]);

  // Filter requirements
  const filterRequirements = () => {
    let filtered = requirements;
    
    if (searchTerm) {
      filtered = filtered.filter(req => 
        req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(req => req.type === typeFilter);
    }
    
    if (priorityFilter !== 'ALL') {
      filtered = filtered.filter(req => req.priority === priorityFilter);
    }
    
    setFilteredRequirements(filtered);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setTimeout(() => {
      filterRequirements();
    }, 300);
  };

  // Apply filters
  const applyFilters = () => {
    filterRequirements();
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setTypeFilter('ALL');
    setPriorityFilter('ALL');
    setFilteredRequirements(requirements);
  };

  // Start editing a requirement
  const startEditing = (requirement: Requirement) => {
    setEditingRequirement({...requirement});
    setIsEditing(true);
  };

  // Save edited requirement
  const saveRequirement = () => {
    if (editingRequirement) {
      // Update the requirements in the context
      const updatedRequirements = requirementsList.map(doc => ({
        ...doc,
        requirements: doc.requirements.map((req, index) => {
          const reqId = `RF-${String(index + 1).padStart(3, '0')}`;
          if (reqId === editingRequirement.id) {
            return {
              ...req,
              feature: editingRequirement.title,
              description: editingRequirement.description,
              type: editingRequirement.type,
              priority: editingRequirement.priority.toString(),
              moscow: editingRequirement.moscow,
              question: editingRequirement.source || ''
            };
          }
          return req;
        })
      }));
      
      // setRequirementsList(updatedRequirements);
      setIsEditing(false);
      setEditingRequirement(null);
      
      toast({
        title: 'Requirement Updated',
        message: 'The requirement has been successfully updated.',
        type: 'success',
      });
    }
  };

  // Delete a requirement
  const deleteRequirement = (id: string) => {
    const indexToDelete = parseInt(id.split('-')[1]) - 1;
    const updatedRequirements = requirementsList.map(doc => ({
      ...doc,
      requirements: doc.requirements.filter((_, index) => index !== indexToDelete)
    }));
    
    setRequirementsList(updatedRequirements);
    
    toast({
      title: 'Requirement Deleted',
      message: 'The requirement has been successfully deleted.',
      type: 'success',
    });
  };

  // Export requirements
  const exportRequirements = () => {
    toast({
      title: 'Export Started',
      message: 'Your requirements are being prepared for export.',
      type: 'info',
    });
    navigate('/projects/1/export');
    setTimeout(() => {
      toast({
        title: 'Export Complete',
        message: 'Requirements have been exported successfully.',
        type: 'success',
      });
    }, 1500);
  };

  // Get MoSCoW label
  const getMoSCoWLabel = (moscow: MoSCoWPriority) => {
    switch (moscow) {
      case 'M': return 'Must Have';
      case 'S': return 'Should Have';
      case 'C': return 'Could Have';
      case 'W': return 'Won\'t Have';
      default: return '';
    }
  };

  // Get MoSCoW color class
  const getMoSCoWColorClass = (moscow: MoSCoWPriority) => {
    switch (moscow) {
      case 'M': return 'bg-error-100 text-error-800 dark:bg-error-900/20 dark:text-error-300';
      case 'S': return 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300';
      case 'C': return 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300';
      case 'W': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error-50 dark:bg-error-900/20 border border-error-100 dark:border-error-800 rounded-lg p-4 text-error-700 dark:text-error-300">
        <div className="flex items-center">
          <AlertTriangle className="mr-2" />
          <h3 className="font-medium">Error loading requirements</h3>
        </div>
        <p className="mt-2 text-sm">{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Requirements Editor
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View, edit, and manage your project requirements
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          <Button
            variant="outline"
            leftIcon={<Plus size={16} />}
            onClick={() => {
              toast({
                title: 'Feature Not Available',
                message: 'Adding new requirements is not available in this demo.',
                type: 'info',
              });
            }}
          >
            Add Requirement
          </Button>
          
          <Button
            variant="outline"
            onClick={exportRequirements}
            leftIcon={<Download size={16} />}
          >
            Export
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search requirements..."
              value={searchTerm}
              onChange={handleSearchChange}
              leftIcon={<Search size={16} />}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm"
            >
              <option value="ALL">All Types</option>
              <option value="F">Functional</option>
              <option value="NF">Non-Functional</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm"
            >
              <option value="ALL">All Priorities</option>
              <option value={1}>P1 (Critical)</option>
              <option value={2}>P2 (High)</option>
              <option value={3}>P3 (Medium)</option>
              <option value={4}>P4 (Low)</option>
              <option value={5}>P5 (Minimal)</option>
            </select>
            
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Filter size={14} />}
              onClick={applyFilters}
            >
              Apply
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
      
      {/* Requirements Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-750">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                    ID <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                    Title <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Priority
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  MoSCoW
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRequirements.map((requirement) => (
                <tr key={requirement.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {requirement.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    <div>
                      <div className="font-medium">{requirement.title}</div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs mt-1 max-w-md line-clamp-2">
                        {requirement.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      requirement.type === 'F'
                        ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300'
                        : 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/20 dark:text-secondary-300'
                    }`}>
                      {requirement.type === 'F' ? 'Functional' : 'Non-Functional'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-6 mx-0.5 rounded-sm ${
                            index < requirement.priority
                              ? 'bg-primary-500'
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        />
                      ))}
                      <span className="ml-2">P{requirement.priority}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getMoSCoWColorClass(requirement.moscow)}`}>
                      {getMoSCoWLabel(requirement.moscow)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {requirement.isComplete ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300">
                        <CheckCircle2 size={12} className="mr-1" />
                        Complete
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300">
                        <AlertTriangle size={12} className="mr-1" />
                        Incomplete
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => startEditing(requirement)}
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteRequirement(requirement.id)}
                      className="text-error-600 hover:text-error-900 dark:text-error-400 dark:hover:text-error-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredRequirements.length === 0 && !isLoading && (
          <div className="py-6 text-center text-gray-500 dark:text-gray-400">
            No requirements found. Try adjusting your filters.
          </div>
        )}
      </div>
      
      {/* Editing Modal */}
      {isEditing && editingRequirement && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Edit Requirement
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    ID
                  </label>
                  <Input
                    value={editingRequirement.id}
                    onChange={(e) => setEditingRequirement({
                      ...editingRequirement,
                      id: e.target.value,
                    })}
                    disabled
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    value={editingRequirement.type}
                    onChange={(e) => setEditingRequirement({
                      ...editingRequirement,
                      type: e.target.value as RequirementType,
                    })}
                    className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    <option value="F">Functional</option>
                    <option value="NF">Non-Functional</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <Input
                  value={editingRequirement.title}
                  onChange={(e) => setEditingRequirement({
                    ...editingRequirement,
                    title: e.target.value,
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={editingRequirement.description}
                  onChange={(e) => setEditingRequirement({
                    ...editingRequirement,
                    description: e.target.value,
                  })}
                  rows={4}
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={editingRequirement.priority}
                    onChange={(e) => setEditingRequirement({
                      ...editingRequirement,
                      priority: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5,
                    })}
                    className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    <option value={1}>P1 (Critical)</option>
                    <option value={2}>P2 (High)</option>
                    <option value={3}>P3 (Medium)</option>
                    <option value={4}>P4 (Low)</option>
                    <option value={5}>P5 (Minimal)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    MoSCoW
                  </label>
                  <select
                    value={editingRequirement.moscow}
                    onChange={(e) => setEditingRequirement({
                      ...editingRequirement,
                      moscow: e.target.value as MoSCoWPriority,
                    })}
                    className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    <option value="M">Must Have</option>
                    <option value="S">Should Have</option>
                    <option value="C">Could Have</option>
                    <option value="W">Won't Have</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Source
                </label>
                <Input
                  value={editingRequirement.source || ''}
                  onChange={(e) => setEditingRequirement({
                    ...editingRequirement,
                    source: e.target.value,
                  })}
                  placeholder="e.g., Stakeholder interview, Document, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={editingRequirement.notes || ''}
                  onChange={(e) => setEditingRequirement({
                    ...editingRequirement,
                    notes: e.target.value,
                  })}
                  rows={2}
                  placeholder="Additional notes or context"
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isComplete"
                  checked={editingRequirement.isComplete}
                  onChange={(e) => setEditingRequirement({
                    ...editingRequirement,
                    isComplete: e.target.checked,
                  })}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <label
                  htmlFor="isComplete"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Mark as complete
                </label>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setEditingRequirement(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={saveRequirement}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Info section at the bottom */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
        <div className="flex items-start">
          <Info size={18} className="text-gray-500 dark:text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="mb-1">
              <strong>Legend:</strong>
            </p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li><strong>F</strong> - Functional Requirement (What the system should do)</li>
              <li><strong>NF</strong> - Non-Functional Requirement (Quality attributes)</li>
              <li><strong>MoSCoW</strong> - Prioritization technique (Must, Should, Could, Won't)</li>
              <li><strong>P1-P5</strong> - Internal priority ranking (P1 being highest)</li>
            </ul>
            <p className="mt-2">
              <a href="#" className="text-primary-600 hover:underline dark:text-primary-400 inline-flex items-center">
                Learn more about requirements engineering 
                <ExternalLink size={14} className="ml-1" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequirementEditor;