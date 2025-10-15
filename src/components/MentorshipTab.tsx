"use client";

import { useState } from 'react';
import { Phone, Calendar, Clock, User, Star, MessageCircle, Video } from 'lucide-react';

export const MentorshipTab = () => {
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);
  const [appointments] = useState([
    {
      id: '1',
      mentorName: 'Carlos Silva',
      date: '2024-02-15',
      time: '14:00',
      status: 'confirmed',
      type: 'video',
      topic: 'Estratégias de Investimento'
    },
    {
      id: '2',
      mentorName: 'Ana Costa',
      date: '2024-02-20',
      time: '16:30',
      status: 'pending',
      type: 'phone',
      topic: 'Planejamento Financeiro'
    }
  ]);

  const mentors = [
    {
      id: '1',
      name: 'Carlos Silva',
      specialty: 'Investimentos e Renda Passiva',
      experience: '15 anos',
      rating: 4.9,
      price: 150,
      avatar: 'CS',
      description: 'Especialista em construção de portfólio e estratégias de longo prazo.',
      availability: ['Segunda', 'Quarta', 'Sexta']
    },
    {
      id: '2',
      name: 'Ana Costa',
      specialty: 'Planejamento Financeiro Pessoal',
      experience: '12 anos',
      rating: 4.8,
      price: 120,
      avatar: 'AC',
      description: 'Focada em organização financeira e criação de reservas de emergência.',
      availability: ['Terça', 'Quinta', 'Sábado']
    },
    {
      id: '3',
      name: 'Roberto Lima',
      specialty: 'Empreendedorismo e Negócios',
      experience: '20 anos',
      rating: 5.0,
      price: 200,
      avatar: 'RL',
      description: 'Mentor de negócios com foco em escalabilidade e liberdade financeira.',
      availability: ['Segunda', 'Terça', 'Quinta']
    }
  ];\

  const bookAppointment = (mentorId: string) => {\n    // Aqui você implementaria a lógica de agendamento\n    console.log('Agendando consulta com mentor:', mentorId);\n  };\n\n  return (\n    <div className=\"space-y-6\">\n      <div className=\"bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 text-white\">\n        <h2 className=\"text-2xl font-bold mb-2\">Mentoria Financeira</h2>\n        <p className=\"text-purple-100\">Acelere sua jornada com orientação especializada!</p>\n      </div>\n\n      {/* Próximos Agendamentos */}\n      <div className=\"bg-white rounded-2xl p-6 border border-gray-200\">\n        <h3 className=\"text-lg font-semibold text-gray-900 mb-4\">Próximos Agendamentos</h3>\n        \n        {appointments.length > 0 ? (\n          <div className=\"space-y-3\">\n            {appointments.map((appointment) => (\n              <div key={appointment.id} className=\"flex items-center justify-between p-4 bg-gray-50 rounded-xl\">\n                <div className=\"flex items-center\">\n                  <div className=\"w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold\">\n                    {appointment.mentorName.split(' ').map(n => n[0]).join('')}\n                  </div>\n                  <div className=\"ml-4\">\n                    <p className=\"font-medium text-gray-900\">{appointment.mentorName}</p>\n                    <p className=\"text-sm text-gray-600\">{appointment.topic}</p>\n                    <div className=\"flex items-center text-sm text-gray-500 mt-1\">\n                      <Calendar className=\"w-4 h-4 mr-1\" />\n                      {new Date(appointment.date).toLocaleDateString('pt-BR')}\n                      <Clock className=\"w-4 h-4 ml-3 mr-1\" />\n                      {appointment.time}\n                    </div>\n                  </div>\n                </div>\n                \n                <div className=\"text-right\">\n                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${\n                    appointment.status === 'confirmed' \n                      ? 'bg-green-100 text-green-800' \n                      : 'bg-yellow-100 text-yellow-800'\n                  }`}>\n                    {appointment.status === 'confirmed' ? 'Confirmado' : 'Pendente'}\n                  </span>\n                  <div className=\"flex items-center mt-2\">\n                    {appointment.type === 'video' ? (\n                      <Video className=\"w-4 h-4 text-blue-600 mr-1\" />\n                    ) : (\n                      <Phone className=\"w-4 h-4 text-green-600 mr-1\" />\n                    )}\n                    <span className=\"text-sm text-gray-500\">\n                      {appointment.type === 'video' ? 'Vídeo' : 'Telefone'}\n                    </span>\n                  </div>\n                </div>\n              </div>\n            ))}\n          </div>\n        ) : (\n          <div className=\"text-center py-8\">\n            <Calendar className=\"w-12 h-12 text-gray-400 mx-auto mb-3\" />\n            <p className=\"text-gray-500\">Nenhum agendamento próximo</p>\n          </div>\n        )}\n      </div>\n\n      {/* Lista de Mentores */}\n      <div className=\"bg-white rounded-2xl p-6 border border-gray-200\">\n        <h3 className=\"text-lg font-semibold text-gray-900 mb-4\">Nossos Mentores</h3>\n        \n        <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6\">\n          {mentors.map((mentor) => (\n            <div key={mentor.id} className=\"border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow\">\n              <div className=\"text-center mb-4\">\n                <div className=\"w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3\">\n                  {mentor.avatar}\n                </div>\n                <h4 className=\"font-semibold text-gray-900\">{mentor.name}</h4>\n                <p className=\"text-sm text-gray-600\">{mentor.specialty}</p>\n              </div>\n              \n              <div className=\"space-y-2 mb-4\">\n                <div className=\"flex items-center justify-between text-sm\">\n                  <span className=\"text-gray-600\">Experiência:</span>\n                  <span className=\"font-medium\">{mentor.experience}</span>\n                </div>\n                \n                <div className=\"flex items-center justify-between text-sm\">\n                  <span className=\"text-gray-600\">Avaliação:</span>\n                  <div className=\"flex items-center\">\n                    <Star className=\"w-4 h-4 text-yellow-400 fill-current\" />\n                    <span className=\"font-medium ml-1\">{mentor.rating}</span>\n                  </div>\n                </div>\n                \n                <div className=\"flex items-center justify-between text-sm\">\n                  <span className=\"text-gray-600\">Valor/hora:</span>\n                  <span className=\"font-bold text-green-600\">${mentor.price}</span>\n                </div>\n              </div>\n              \n              <p className=\"text-sm text-gray-600 mb-4\">{mentor.description}</p>\n              \n              <div className=\"mb-4\">\n                <p className=\"text-sm font-medium text-gray-700 mb-2\">Disponibilidade:</p>\n                <div className=\"flex flex-wrap gap-1\">\n                  {mentor.availability.map((day) => (\n                    <span key={day} className=\"px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full\">\n                      {day}\n                    </span>\n                  ))}\n                </div>\n              </div>\n              \n              <button\n                onClick={() => bookAppointment(mentor.id)}\n                className=\"w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300\"\n              >\n                Agendar Consulta\n              </button>\n            </div>\n          ))}\n        </div>\n      </div>\n\n      {/* Como Funciona */}\n      <div className=\"bg-purple-50 border border-purple-200 rounded-2xl p-6\">\n        <h3 className=\"text-lg font-semibold text-purple-900 mb-4\">Como Funciona a Mentoria</h3>\n        <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">\n          <div className=\"text-center\">\n            <div className=\"w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-3\">\n              <User className=\"w-6 h-6\" />\n            </div>\n            <h4 className=\"font-semibold text-purple-900 mb-2\">1. Escolha seu Mentor</h4>\n            <p className=\"text-purple-700 text-sm\">Selecione o especialista que melhor se alinha com seus objetivos financeiros.</p>\n          </div>\n          \n          <div className=\"text-center\">\n            <div className=\"w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-3\">\n              <Calendar className=\"w-6 h-6\" />\n            </div>\n            <h4 className=\"font-semibold text-purple-900 mb-2\">2. Agende sua Sessão</h4>\n            <p className=\"text-purple-700 text-sm\">Escolha o melhor horário e formato (presencial, vídeo ou telefone).</p>\n          </div>\n          \n          <div className=\"text-center\">\n            <div className=\"w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-3\">\n              <MessageCircle className=\"w-6 h-6\" />\n            </div>\n            <h4 className=\"font-semibold text-purple-900 mb-2\">3. Receba Orientação</h4>\n            <p className=\"text-purple-700 text-sm\">Tenha uma sessão personalizada com estratégias específicas para seu caso.</p>\n          </div>\n        </div>\n      </div>\n    </div>\n  );\n};